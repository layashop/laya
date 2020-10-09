import React from "react"
import PropTypes from "prop-types"
import { Box } from "theme-ui"

const Searchbar = ({ value, onChange, ...props }) => {
  return (
    <Box __css={{
      width: '100%',
      display: 'flex',
      borderRadius: '4px',
      '> *': {
        p: 'xsmall', border: '0',
        border: '1px solid #ccc',
        lineHeight: 1.5,
        fontSize: 16,
      }
    }} {...props}>
      <Box as='input' type='text' name="search" aria-label="Buscar" value={value} onChange={(e) => onChange(e.target.value)} sx={{ flex: 1, borderTopLeftRadius: '4px', borderBottomLeftRadius: '4px', borderRight: '0px' }} />
      <Box as='input' type='submit' __css={{
        borderTopRightRadius: '4px',
        borderBottomRightRadius: '4px',
        minWidth: '10%',
        borderLeft: 0, cursor: 'pointer',
        color: 'buttonText', bg: 'buttonBg', transition: '0.25s', ':hover': {
          boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.15)'
        }
      }} value='Buscar' />
    </Box>
  )
}

Searchbar.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired
}

export default Searchbar
