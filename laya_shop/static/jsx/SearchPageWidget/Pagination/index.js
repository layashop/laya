import React, { useState, useEffect } from "react"
import { Box } from "theme-ui"
import PropTypes from "prop-types"

const Pagination = ({ currentPage, lastPage, linkQuantity, link }) => {

  const beforeLinks = []
  const afterLinks = []

  for (let i = linkQuantity; i > 0; i--) {
    if (currentPage - i >= 1) {
      beforeLinks.push(currentPage - i)
    }
    if (currentPage + i <= lastPage) {
      afterLinks.push(currentPage + i)
    }
  }

  return (
    <Box __css={{
      display: 'flex', alignItems: 'center', m: 'small', color: 'buttonText', '> *': { bg: 'white', ml: 'small', px: 'xsmall', cursor: 'pointer', textDecoration: 'none', borderRadius: '4px' }, '> div': { border: '2px solid black', cursor: 'default' }, '> a': {
        transition: '0.25s', ':hover': {
          boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.15)'
        }
      }
    }}>
      Página:
      {currentPage - linkQuantity > 1 && <Box as="a" href={`${link}&page=1`}>{'<<'}</Box>}
      {beforeLinks.map(val => <Box as="a" key={`before-${val}`} href={`${link}&page=${val}`}>{val}</Box>)}
      <Box>{currentPage}</Box>
      {afterLinks.reverse().map(val => <Box as="a" key={`after-${val}`} href={`${link}&page=${val}`}>{val}</Box>)}
      {currentPage + linkQuantity < lastPage && <Box as="a" href={`${link}&page=${lastPage}`}>{'>>'}</Box>}
    </Box>
  )
}

export default Pagination
