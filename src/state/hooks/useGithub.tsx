import React from 'react'
import axios from 'axios'
import { AuthState, StarredRepo } from 'types/GithubTypes'
import { reject } from 'q'
import useAppState from './useAppState'
import { GithubContext } from '../providers/GithubProvider'
import { AppStateContext } from 'state/providers/AppStateProvider'

const GQLApi = 'https://api.github.com/graphql'

export const GET_USER = `{viewer {name login url avatarUrl}}`
export const queryStars = (batchSize: number, cursor: string) => `{
      viewer{
        starredRepositories(first:${batchSize} ${
  cursor.length > 0 ? `,after: "${cursor}"` : ``
}){
          totalCount
          edges{
            cursor
            node{
              id
              name
              url
              owner {login}
              description
              stargazers{totalCount}
              forkCount
              pushedAt
              languages(last: 50) {
                totalSize
                edges {
                  node {name}
                  size
                }
              }
            }
          }
        }
      }
    }`

export default function useGithub() {
  const context = React.useContext(GithubContext)
  if (!context)
    throw new Error('useGithub must be used within a GithubProvider')
  if (!React.useContext(AppStateContext))
    throw new Error('useSearch must be used within a AppStateContext')

  const { authState, setAuthState, isSyncing, setIsSyncing } = context

  const {
    accessToken,
    setAccessToken,
    setUser,
    stars,
    setStars,
    setLastSyncDate,
    clearLocalData,
    tags,
    setTags
  } = useAppState()

  const gqlRequest = (query: string, headers?: any) => {
    return axios.post(
      `${GQLApi}`,
      { query: query },
      {
        headers: { Authorization: `bearer ${accessToken}`, ...headers }
      }
    )
  }

  const authorize = async (
    token: string,
    cb: (success: boolean, payload: any) => void = () => {}
  ) => {
    try {
      const res = await gqlRequest(GET_USER, {
        Authorization: `bearer ${token}`
      })

      if (res.status === 200) {
        const data = res.data.data.viewer
        setAccessToken(token)
        setUser({
          login: data.login,
          name: data.name,
          url: data.url,
          avatar_url: data.avatarUrl
        })
        setAuthState(AuthState.loggedIn)
        cb(true, res)
      } else {
        reject(new Error('status failed')).catch(e => {
          setAuthState(AuthState.loggedOut)
          cb(false, res)
          console.error(e, res)
        })
      }
    } catch (error) {
      setAuthState(AuthState.loggedOut)
      cb(false, error)
      console.error(error.response)
    }
  }

  const fetchStars = async (
    accumulator: StarredRepo[] = [],
    i: number = 0,
    cursor: string = '',
    batchSize: number = 100
  ) => {
    setIsSyncing(true)
    try {
      if (batchSize > 100 || batchSize < 0)
        throw 'batchSize must be between -1 and 101'

      const res = await gqlRequest(queryStars(batchSize, cursor))

      const repos = res.data.data.viewer.starredRepositories
      const loopCount = Math.ceil(repos.totalCount / batchSize)

      cursor = repos.edges[repos.edges.length - 1].cursor
      accumulator = [...accumulator, ...repos.edges.map((s: any) => s.node)]

      if (++i < loopCount) {
        fetchStars(accumulator, i, cursor)
      } else {
        // Data fetching complete, set all the things
        const repos = cleanStarData(accumulator, stars)
        setStars(repos.reverse())
        setIsSyncing(false)
        setLastSyncDate(new Date())

        // Get list of tags on fetched repos
        const tags = repos.reduce(
          (acc: string[], curr) => [
            ...acc,
            ...curr.tags.filter(t => !acc.find(a => a === t))
          ],
          []
        )
        updateTags(tags)
      }
    } catch (error) {
      setIsSyncing(false)
      console.error(error)
    }
  }

  const updateTags = (newTags: string[]) => {
    const diff = newTags.filter(nt => !tags.find(t => t === nt))
    setTags(prev => [...prev, ...diff].sort())
  }

  const autoLogin = () => {
    if (accessToken !== '') {
      authorize(accessToken)
    }
  }

  const logout = (clearUserData: boolean = false) => {
    setAuthState(AuthState.loggedOut)
    setAccessToken('')
    if (clearUserData) {
      clearLocalData()
    }
  }

  return {
    authorize,
    authState,
    autoLogin,
    logout,
    fetchStars,
    isSyncing
  }
}

export const cleanStarData = (starData: any[], localStars: StarredRepo[]) => {
  const repos: StarredRepo[] = starData.map((star: any) => {
    const existing = localStars.find(s => s.id === star.id)
    const totalSize = star.languages.totalSize
    const inclusionPerc = 15.0 // Percentage threshold for language to be included as a tag

    let languages = []

    if (star.languages.edges) {
      languages = star.languages.edges
        .map((l: any) => {
          return {
            name: l.node.name,
            size: l.size,
            perc: (l.size / totalSize) * 100
          }
        })
        .filter((l: any) => l.perc > inclusionPerc)
        .map((l: any) => l.name)
    }

    const tags = existing ? existing.tags : languages

    return {
      id: star.id,
      ownerLogin: star.owner.login,
      name: star.name,
      htmlUrl: star.url,
      description: star.description || '',
      stargazersCount: star.stargazers.totalCount,
      forksCount: star.forkCount,
      pushedAt: star.pushedAt,
      tags: tags
    }
  })

  return repos
}
