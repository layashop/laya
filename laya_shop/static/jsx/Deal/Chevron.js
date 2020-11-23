import React from 'react'
import {Box} from 'theme-ui'

const IconChevron = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="icon-tabler icon-tabler-chevron-down" width="44" height="44"
         viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2c3e50" fill="none" strokeLinecap="round"
         strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <polyline points="6 9 12 15 18 9"/>
    </svg>)

const Chevron = ({show, onClick, ...props}) => (
    <Box __css={{transform: show ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.5s'}} onClick={onClick} {...props}><IconChevron /></Box>
)

export default Chevron
