import React, {useState} from 'react'
import DealItem from './DealItem'
import {Box} from 'theme-ui'
import _ from 'lodash'

const IconChevron = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="icon-tabler icon-tabler-chevron-down" width="44" height="44"
         viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2c3e50" fill="none" strokeLinecap="round"
         strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <polyline points="6 9 12 15 18 9"/>
    </svg>)

const DealCategory = ({category, data = []}) => {
    const [show, setShow] = useState(false)
    const toggleShow = () => setShow((prevState) => !prevState)
    console.log(category)
    return <Box __css={{px:'10px', py: '10px'}} id={`category-${category}`}>
        <Box __css={{fontSize:'24px', display:'flex', lineHeight: 1.7}} onClick={toggleShow}>
            {category}
            <Box __css={{transform: show ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.5s'}}><IconChevron /></Box>
        </Box>
        {show && <Box>
            {data.map(deal => <DealItem deal={deal}/>)}
        </Box>}

    </Box>
}

export default DealCategory
