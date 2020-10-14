import React from "react"
import ReactDOM from 'react-dom'
import { ThemeProvider, Box } from "theme-ui"
import SearchWidget from './SearchPageWidget/SearchWidget/index'
import ResultsWidget from './SearchPageWidget/ResultsWidget/index'
import theme from './utils/theme'

const Root = () => {
  return (
    <ThemeProvider theme={theme}>
      <Box __css={{ display: 'flex', flexDirection: ['column', null, 'row'] }}>
        <SearchWidget sx={{ maxWidth: [null, null, null, '300px'], width: ['100%', null, '100%'], p: ['small', null, null, 'medium'] }} />
        {/*<ResultsWidget sx={{ flex: 1, bg: '#EDF2F7' }} />*/}
      </Box>
    </ThemeProvider>
  )
}


ReactDOM.render( <Root />, document.getElementById('search-component'))


