import React from 'react'
import {Box} from 'theme-ui'

const Tag = ({color, children, ...props}) => (
    <Box __css={{
        bg: color,
        p: '5px',
        fontWeight: 'bold',
        color: 'white',
        borderRadius: '5px',
        mr: '20px'
    }}
         {...props}
    >
        {children}
    </Box>
)

export default Tag
