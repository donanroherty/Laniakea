import React from 'react'
import ReactDOM from 'react-dom'
import * as serviceWorker from './serviceWorker'
import { ThemeProvider } from 'theme/themed-styled-components'
import theme from 'theme/theme'

import App from './components/App'

import GithubProvider from 'state/providers/GithubProvider'
import SearchProvider from 'state/providers/SearchProvider'
import TagProvider from 'state/providers/TagProvider'
import SettingsProvider from 'state/providers/SettingsProvider'

import { DndProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import AppStateProvider from 'state/providers/AppStateProvider'
import PopupProvider from 'state/providers/PopupProvider'

ReactDOM.render(
  <AppStateProvider>
    <SettingsProvider>
      <GithubProvider>
        <TagProvider>
          <SearchProvider>
            <DndProvider backend={HTML5Backend}>
              <ThemeProvider theme={theme}>
                <PopupProvider>
                  <App />
                </PopupProvider>
              </ThemeProvider>
            </DndProvider>
          </SearchProvider>
        </TagProvider>
      </GithubProvider>
    </SettingsProvider>
  </AppStateProvider>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
