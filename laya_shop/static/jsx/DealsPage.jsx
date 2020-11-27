import React, {useState, useEffect} from 'react'
import {render} from 'react-dom'
import DealCategory from './Deal/DealCategory'
import {Box} from 'theme-ui'
import {useFetch, LOADING, FINISHED} from './utils/useFetch'

const API = 'http://localhost:8000/api/deals'
// Status, Sent by, User
const choices = {
    1: "Pendiente",
    2: "Rechazado",
    3: "Cancelado",
    4: "Reservado",
    5: "Acordado",
    6: "En Delivery",
    7: "Entregado",
    8: "Devuelto",
}
const DealPage = () => {

    const [loading, error, sendRequest] = useFetch()
    const [deals, setDeals] = useState([])
    const [groupData, setGroupedData] = useState({})
    const isUser = IS_USER
    const loadDeals = async () => {
        const query = isUser ? `user&user=${USER.id}` : `business&business=${BUSINESS.id}`

        try {
            const result = await sendRequest(`${API}/?type=${query}`)
            if (!result.error) {
                setDeals(result)
            }
        } catch (e) {
            alert('There was an Error')
        }
    }
    useEffect(() => {
        loadDeals()
    }, [])
    useEffect(() => {
        if (deals.length > 0) {
            const newGroupedData = Object.entries(choices).reduce((groupedData, [key, value]) => {
                const fixedKey = parseInt(key)
                groupedData[value] = deals.filter(deal => {
                    return deal.status === fixedKey
                })
                return groupedData
            }, {})
            setGroupedData(newGroupedData)
        }
    }, [deals])


    const handleUpdateData = (deal, index) => {
        const newDeals = [...deals]
        newDeals[index] = deal
        setDeals(newDeals)
    }

    let component
    if (loading === LOADING) {
        component = <div className={'loader-dark'}>Loading...</div>
    }

    if (loading === FINISHED) {
        if (deals.length > 0) {
            component = Object.entries(groupData).map(([category, data]) => <DealCategory category={category}
                                                                                          data={data}/>)
        } else {
            component = 'No hay información'
        }
    }

    return (<div className="md:pt-20 lg:mx h-screen divide-y flex flex-col"
    >
        <div>
            <h2 className={'text-2xl px-5 border-b border-blue-400 border-opacity-50'}>Acuerdos de intercambio</h2>
        </div>
        <Box __css={{bg:'white', pt: '8px', px: '50px', flex: 1, '& > div:not(:first-of-type)': {borderTop: '1px solid #63b3ed'} }}>
            {component}
        </Box>
    </div>)

}

// Id del Acuerdo , Mostrar el Usuario o el Business, Estado


const page = document.getElementById('deals')
render(<DealPage/>, page)
