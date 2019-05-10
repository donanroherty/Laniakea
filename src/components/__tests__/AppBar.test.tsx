import React from 'react'
import AppBar from '../AppBar'
import App from '../App'
import { render, cleanup, fireEvent } from '../utils/test-utils'
import { ToolbarPanelOptions } from '../App'

afterEach(() => cleanup())

const setActiveToolbarPanel = jest.fn()

test('<AppBar /> renders itself and buttons', () => {
  const component = render(
    <AppBar
      setActiveToolbarPanel={setActiveToolbarPanel}
      activeToolbarPanel={ToolbarPanelOptions.Search}
    />
  )
  expect(component).toBeTruthy()

  const { getByTitle } = component
  expect(getByTitle('Search')).toBeTruthy()
  expect(getByTitle('Settings')).toBeTruthy()
})

test('Clicking buttons opens correct panels', () => {
  const { getByTestId, getByTitle } = render(<App />)
  expect(getByTestId('search-tool-panel')).toBeTruthy()
  fireEvent.click(getByTitle('Settings'))
  expect(getByTestId('settings-tool-panel')).toBeTruthy()
  fireEvent.click(getByTitle('Search'))
  expect(getByTestId('search-tool-panel')).toBeTruthy()
})

test('Clicking buttons calls correct functions', () => {
  const { getByTitle } = render(
    <AppBar
      setActiveToolbarPanel={setActiveToolbarPanel}
      activeToolbarPanel={ToolbarPanelOptions.Search}
    />
  )
  fireEvent.click(getByTitle('Settings'), ToolbarPanelOptions.Settings)
  expect(setActiveToolbarPanel).toHaveBeenCalledTimes(1)
  expect(setActiveToolbarPanel).toHaveBeenCalledWith(
    ToolbarPanelOptions.Settings
  )
  fireEvent.click(getByTitle('Search'), ToolbarPanelOptions.Search)
  expect(setActiveToolbarPanel).toHaveBeenCalledTimes(2)
  expect(setActiveToolbarPanel).toHaveBeenCalledWith(ToolbarPanelOptions.Search)
})
