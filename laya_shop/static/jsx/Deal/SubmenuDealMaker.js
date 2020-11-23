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

        const {status, ...data} = activeDeal

        data.originalStatus = status
        data.originalSendDate = new Date()
        data.pending = 'pending'

        /// DIAS PARA EXPIRARSE
        const expires_at = new Date()
        expires_at.setDate(expires_at.getDate() + 3)


        if (activeDeal.id) {

            const oldHistory = [...dealData[selectedDealIndex].history]

            if (oldHistory[oldHistory.length - 1].pending === 'pending') {
                oldHistory[oldHistory.length - 1].pending = 'changed'
            }

            const newEntry = {
                user,
                business,
                sent_by: isBusiness ? 2 : 1,
                status: 1,
                expires_at,
                history: [...oldHistory, data],
            }

            fetch(`/api/deals/${activeDeal.id}/`, {
                method: 'PUT',
                body: JSON.stringify(newEntry),
                headers: {
                    'Content-Type': 'application/json',
                    "X-CSRFToken": getCookie('csrftoken')
                }
            })
                .then(response => response.json())
                .then(data => onSubmit(data.id))


        } else {


            const newEntry = {
                user,
                business,
                sent_by: isBusiness ? 2 : 1,
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
            })
                .then(response => response.json())
                .then(data => onSubmit(data.id))

        }


    }

    const openMaker = (e, index) => {
        if (index === -1) {
            setActiveDeal({currency: 1, date: new Date(), deliveryMethod: 1, status: 5})
            setSelectedPost([])
            setSelectedDealIndex(-2)
        } else {

            const data = dealData[index].history[dealData[index].history.length - 1]

            console.log(data)
            const today = new Date()
            setActiveDeal({
                id: dealData[index].id,
                ...data
            })
            const selectedProducts = []
            for (let product of data.products) {
                const index = _.findIndex(postData, {id: product.id})
                if (index !== -1) {
                    selectedProducts.push(postData[index])
                }
            }

            setActiveDeal({
                id: dealData[index].id,
                status: 5,
                currency: data.currency,
                deliveryInstructions: data.deliveryInstructions,
                deliveryMethod: data.deliveryMethod,
                date: today > new Date(data.date) ? today : new Date(data.date),
                products: data.products,
                returnPolicy: data.returnPolicy,
                promo: data.promo
            })
            setSelectedPost(selectedProducts)
            setSelectedDealIndex(index)
        }
    }


    useEffect(() => {
        fetch(`/api/deals/?business_id=${business}&user_id=${user}`)
            .then(res => res.json())
            .then(data => {
                setDealData(data.filter(entry => !(entry.status === 2 || entry.status === 3 || entry.status === 8 || entry.status === 7)))
                setIsLoadedDealData(true)
            })
    }, [])
    return (<Box __css={{
        maxHeight: ['75vh'],
        minHeight: ['75vh'],
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
                <Box as="button" onClick={(e) => openMaker(e, -1)}>Nuevo acuerdo</Box>
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
            <Box className="bg-gray-100"
                 __css={{flex: 1, borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', overflowY: 'auto'}}>
                {isLoadedDealData && dealData.length > 0 && <Box __css={{display: 'flex', flexWrap: 'wrap'}}>
                    {dealData.map((item, index) => {
                        return (
                            <Box key={item.id}
                                 __css={{
                                     width: ['100%', null, 'calc(50% - 20px)'],
                                     m: '10px',
                                     borderRadius: '10px',
                                     bg: 'white',
                                     transition: '0.1s',
                                     ':hover': {bg: '#eee'},
                                     cursor: 'pointer',
                                     p: '20px',
                                     fontSize: '18px',
                                     display: 'flex',
                                     justifyContent: 'space-between'
                                 }} onClick={(e) => openMaker(e, index)}>
                                <Box __css={{fontWeight: 'bold'}}>Acuerdo #{`${_.padStart(item.id, 7, '0')}`}</Box>
                                <Box>{choices[item.status]}</Box>
                            </Box>
                        )
                    })}
                </Box>}
                {isLoadedDealData && dealData.length === 0 && <Box>No existen registros previos editables</Box>}
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
