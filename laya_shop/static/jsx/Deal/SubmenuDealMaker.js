import React, {useState, useEffect} from 'react'
import {Box} from 'theme-ui'
import DealMaker from "./DealMaker";
import _ from 'lodash'


const getCookie = (name) => {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const choices = {
    1: "Pendiente",
    2: "Rechazado",
    3: "Cancelado",
    4: "Reservado",
    5: "Acordado",
    6: "En Delivery",
    7: "Entregado",
    8: "Devuelto",
    9: "Cerrado"
}

const SubmenuDealMaker = ({
                              isLoadedPostData, postData, user, business, selectedPost,
                              setSelectedPost, onSubmit, isBusiness
                          }) => {

    const [dealData, setDealData] = useState([])
    const [isLoadedDealData, setIsLoadedDealData] = useState(false)
    // -1 : buscando
    // -2 : creando
    // 0+ : uno en especifico
    const [searchText, setSearchText] = useState('')
    const [selectedDealIndex, setSelectedDealIndex] = useState(-1)
    // el que se esta creando/editando
    const [activeDeal, setActiveDeal] = useState({})

    const submitHandler = (e) => {
        e.preventDefault()

        const products = selectedPost.map(item => {
            return _.find(activeDeal.products, {id: item.id})
        })


        if (activeDeal.id) {
            return console.log('wtf')
        } else {
            const {status, ...data} = activeDeal

            data.originalStatus = status
            data.originalSendDate = new Date()
            data.pending = 'pending'

            /// DIAS PARA EXPIRARSE
            const expires_at = new Date()
            expires_at.setDate(expires_at.getDate() + 3)

            const newEntry = {
                user,
                business,
                sent_by: isBusiness ? 2: 1,
                status: 1,
                expires_at,
                history: [data],
            }

            fetch(`/api/deals/`, {
                method: 'POST',
                body: JSON.stringify(newEntry),
                headers: {
                    'Content-Type': 'application/json',
                    "X-CSRFToken": getCookie('csrftoken')
                }
            }).then(response => response.json())
                .then(data => console.log(data))

        }


    }

    const openMaker = (e, index) => {
        if (index === -1) {
            setActiveDeal({currency: 1, date: new Date(), deliveryMethod: 1, status: 5})
            setSelectedPost([])
            setSelectedDealIndex(-2)
        } else {

            const data = dealData[index].history[dealData[index].history.length - 1]

            setActiveDeal({
                id: dealData[index].id,
                ...data
            })
            const selectedProducts = []
            for (let i of data.products) {
                const index = _.findIndex(postData, {id: data.products[i].id})
                if (index !== -1) {
                    selectedProducts.push(index)
                }
            }
            setSelectedPost(selectedProducts)
            setSelectedDealIndex(index)
        }
    }


    useEffect(() => {
        setTimeout(() => setIsLoadedDealData(true), 1500)
    }, [])
    return (<Box __css={{
        maxHeight: ['75vh', '60vh'],
        minHeight: ['75vh', '60vh'],
        display: 'flex',
        flexDirection: 'column',
    }}>
        {selectedDealIndex === -1 && <>
            <Box __css={{
                display: 'flex', justifyContent: 'space-between', width: '100%', pb: '12px',
                mt: '16px',
                px: '30px',
                fontSize: '30px',
                borderBottom: '2px solid rgba(66, 153, 225, 0.5)'
            }}>
                <Box as="h3" __css={{fontSize: '30px'}}>Seleccione un acuerdo</Box>
                <Box as="button" onClick={e => openMaker(e, -1)}>Nuevo acuerdo</Box>
            </Box>
            <Box __css={{
                minHeight: '50px',
                button: {
                    cursor: 'pointer',
                    color: 'rgb(49, 151, 149)',
                    flex: 1,
                    px: '5px',
                    py: '4px',
                    bg: 'white',
                    transition: '100ms',
                    ':hover': {
                        bg: 'rgb(226, 232, 240)',
                    }
                },
                display: 'flex',
                alignItems: 'stretch'
            }}>
                <Box as="input" __css={{bg: 'white', width: '80%', px: '30px'}} placeholder="Busque por ID"
                     onChange={e => setSearchText(e.target.value)}
                     value={searchText}
                />
                <Box as="button" onClick={e => {
                    e.preventDefault()
                    setSearchQuery(searchText)
                }}>Limpiar Búsqueda</Box>
            </Box>
            <Box>
                {isLoadedDealData && dealData.length > 0 && <Box __css={{display: 'flex'}}>
                    {dealData.maps((item, index) => {
                        // rechazado || cancelado || devuelto
                        if (item.status === 2 || item.status === 3 || item.status === 8)
                            return (
                                <Box onClick={() => openMaker(e, index)}>
                                    <Box>#{`${_.padStart(item.id, 7, '0')}`}</Box>
                                    <Box>${choices[item.status]}</Box>
                                </Box>
                            )
                    })}
                </Box>}
                {isLoadedDealData && dealData.length === 0 && <Box>No existen registros previos</Box>}
                {!isLoadedDealData && <div className="loader-dark mt-4">Loading...</div>}
            </Box>
        </>}
        {selectedDealIndex !== -1 &&
        <DealMaker activeDeal={activeDeal} isNew={selectedDealIndex === -2} isLoadedPost={isLoadedPostData}
                   postData={postData}
                   selectedPost={selectedPost} setSelectedPost={setSelectedPost} setActiveDeal={setActiveDeal}
                   isBusiness={isBusiness}
                   onSubmit={submitHandler}/>}
    </Box>)
}

export default SubmenuDealMaker
