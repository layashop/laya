import React, {useState, useEffect} from 'react'
import {render} from 'react-dom'
import DealCategory from './Deal/DealCategory'
import {Box} from 'theme-ui'
import _ from 'lodash'
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

    const [searchQuery, setSearchQuery] = useState('')
    const [openIndex, setOpenIndex] = useState(-1)
    const [loading, error, sendRequest] = useFetch()
    const [deals, setDeals] = useState([])
    const [groupData, setGroupedData] = useState({})
    const isUser = IS_USER
    const loadDeals = async (showLoad = true) => {
        const query = isUser ? `user&user=${USER.id}` : `business&business=${BUSINESS.id}`

        try {
            const result = await sendRequest(`${API}/?type=${query}`, {}, showLoad)
            if (!result.error) {
                setDeals(result)
            }
        } catch (e) {
            alert('There was an Error')
        }
    }
    useEffect(() => {
        loadDeals()
        if (window.location.hash) {
            setOpenIndex(Number.parseInt(window.location.hash.slice(1)))
            window.location.hash = ''
        }
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

    const handleUpdateData = (deal) => {
        loadDeals(false)
    }

    const handleOpenItem = (id) => {
        setOpenIndex(id)
    }

    let component
    if (loading === LOADING) {
        component = <div className={'loader-dark'}>Cargando...</div>
    }

    if (loading === FINISHED) {
        if (deals.length > 0) {
            component = Object.entries(groupData).map(([category, data]) => <DealCategory category={category}
                                                                                          data={data}
                                                                                          handleUpdateData={handleUpdateData}
                                                                                          handleOpenItem={handleOpenItem}
                                                                                          openIndex={openIndex}
                                                                                          searchQuery={searchQuery.toLowerCase()}
            />)
        } else {
            component = 'No hay información'
        }
    }

    return (<div className="md:pt-20 lg:mx h-screen divide-y flex flex-col"
    >
        <div>
            <h2 className={'text-2xl px-5 border-b border-blue-400 border-opacity-50'}>Acuerdos de intercambio</h2>
        </div>
        <Box __css={{
            display: 'flex',
            bg:'white'
        }}>
            <Box as="input" __css={{p: '10px', pl: '50px', flex:'1'}} placeholder="Buscar por nombre o id" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
            <Box as="button" onClick={(e) => {
                e.preventDefault()
                setSearchQuery('')
            }} __css={{
                color: 'rgb(49, 151, 149)',
                p: '10px',
                bg: 'white',
                mr:'50px',
                transition: '0.5s',
                ':hover': {
                    bg:'#e6e6e6'
                }
            }}
            >Limpiar Búsqueda</Box>
        </Box>
        <Box __css={{
            bg: 'white',
            pt: '8px',
            px: '50px',
            flex: 1,
            '& > div:not(:first-of-type)': {borderTop: '1px solid #63b3ed'}
        }}>
            {component}
        </Box>
    </div>)

}

// Id del Acuerdo , Mostrar el Usuario o el Business, Estado


const page = document.getElementById('deals')
render(<DealPage/>, page)
