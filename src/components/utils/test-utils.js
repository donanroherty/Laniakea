import React from 'react'
import { render } from 'react-testing-library'
import { ThemeProvider } from '../../theme/themed-styled-components'
import theme from '../../theme/theme'

const GlobalProviders = ({ children }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}

const customRender = (ui, options) =>
  render(ui, { wrapper: GlobalProviders, ...options })

// re-export everything
export * from 'react-testing-library'

// override render method
export { customRender as render }