import React, {useState} from 'react'
import {Box} from 'theme-ui'
import _ from 'lodash'
import getCookie from "../utils/getCookies";
import IconResolver from "../ChatWidget/IconResolver";

const StarCount = Array.apply(null, Array(5))


const StarHandler = ({deal, handleUpdateData}) => {

    const count = deal.rating

    const [isLoading, setIsLoading] = useState(false)

    const handleClick = (e, index) => {
        e.preventDefault()
        if (isLoading) {
            return
        }
        const newDeal = {...deal}

        newDeal.rating = index + 1

        if (typeof newDeal.user === 'object') {
            newDeal.user = newDeal.user.id
        }
        if (typeof newDeal.business === 'object') {
            newDeal.business = newDeal.business.id
        }

        console.log(newDeal, index)

        setIsLoading(true)

        fetch(`/api/deals/${deal.id}/`, {
            method: 'PUT',
            body: JSON.stringify(newDeal),
            headers: {
                'Content-Type': 'application/json',
                "X-CSRFToken": getCookie('csrftoken')
            }
        })
            .then(response => response.json())
            .then(data => {
                handleUpdateData()
                setIsLoading(false)
            })
    }

    return <>
        <Box as="h3" __css={{fontWeight: 'bold'}}>Califica este acuerdo de intercambio:</Box>
        <Box __css={{display: 'flex'}}>
            {StarCount.map((el, index) => {
                return <Box onClick={e => handleClick(e, index)} __css={{
                    color: index < count ? '#000' : '#ccc',
                    ':hover': {
                        color: index < count ? '' : '#777'
                    },
                    mr: '6px',
                    cursor: isLoading ? 'wait' : 'pointer'
                }}>
                    <IconResolver icon="star"/>
                </Box>
            })
            }
            <Box __css={{ml: '20px'}}>{isLoading ? "Enviando puntuación..." : (count == null) ? "Haz click para puntuar" : "¡Gracias por tu retroalimentación!"}</Box>
        </Box>
    </>
}

export default StarHandler
