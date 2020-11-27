import React, {useState} from 'react'
import DealItem from './DealItem'
import Chevron from "./Chevron"
import {Box} from 'theme-ui'
import _ from 'lodash'

const DealCategory = ({category, handleUpdateData, handleOpenItem, openIndex, searchQuery, data = []}) => {
    console.log(category)
    const [show, setShow] = useState(category === "Pendiente")
    const toggleShow = () => setShow((prevState) => !prevState)
    return <Box __css={{px: '10px', py: '10px'}} id={`category-${category}`}>
        <Box __css={{fontSize: '24px', display: 'flex', lineHeight: 1.7}} onClick={toggleShow}>
            {category}
            <Chevron show={show}/>
        </Box>
        { (searchQuery !== '' || show) && <Box>
            {data.map(deal => {
                if (searchQuery !== '') {
                    if (!(`#${_.padStart(deal.id, 7, '0')}`.includes(searchQuery) || (IS_USER ? `${(deal.business.name)}` : `${(deal.user.name || deal.user.username)}`).toLowerCase().includes(searchQuery))) {
                        return false
                    }
                }

                return <DealItem deal={deal} show={deal.id === openIndex} handleUpdateData={handleUpdateData}
                                 handleOpenItem={handleOpenItem}/>
            })}
        </Box>}

    </Box>
}

export default DealCategory
