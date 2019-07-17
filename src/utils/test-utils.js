import React from 'react'
import { render } from '@testing-library/react'
import theme from 'theme/theme'
import { ThemeProvider } from 'theme/themed-styled-components'
import { SearchProvider } from 'state/search-context'
import { TagProvider } from 'state/tag-context'
import { DndProvider } from 'react-dnd'
import { GithubProvider } from 'state/github-context'
import HTML5Backend from 'react-dnd-html5-backend'

const GlobalProviders = ({ children }) => {
  return (
    <GithubProvider>
      <ThemeProvider theme={theme}>
        <DndProvider backend={HTML5Backend}>
          <TagProvider>
            <SearchProvider>
             {children}
            </SearchProvider>
          </TagProvider>
        </DndProvider>
      </ThemeProvider>
    </GithubProvider>
  )
}

const customRender = (ui, options) =>
  render(ui, { wrapper: GlobalProviders, ...options })

// re-export everything
export * from '@testing-library/react'

// override render method
export { customRender as render }
