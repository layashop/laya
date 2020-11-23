import React, {useState} from 'react'
import DealItem from './DealItem'
import Chevron from "./Chevron"
import {Box} from 'theme-ui'

const DealCategory = ({category, data = []}) => {
    const [show, setShow] = useState(false)
    const toggleShow = () => setShow((prevState) => !prevState)
    console.log(category)
    return <Box __css={{px:'10px', py: '10px'}} id={`category-${category}`}>
        <Box __css={{fontSize:'24px', display:'flex', lineHeight: 1.7}} onClick={toggleShow}>
            {category}
            <Chevron show={show} />
        </Box>
        {show && <Box>
            {data.map(deal => <DealItem deal={deal}/>)}
        </Box>}

    </Box>
}

export default DealCategory
