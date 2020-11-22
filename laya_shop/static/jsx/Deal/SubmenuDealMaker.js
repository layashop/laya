import React, {useState} from 'react'
import {Box} from 'theme-ui'
import DealMaker from "./DealMaker";

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
    const [selectedDealIndex, setSelectedDealIndex] = useState(-1)
    // el que se esta creando/editando
    const [activeDeal, setActiveDeal] = useState({})

    const submitHandler = (e, deal) => {
        e.preventDefault()
        if (Object.hasOwnProperty('savedData')) {
            console.log(deal)
        }

        setSelectedDealIndex(-1)
    }

    const openMaker = (e, index) => {
        if (index === -1) {
            setActiveDeal({})
            setSelectedDealIndex(-2)
        } else {
            setActiveDeal({
                id: dealData[index].id,
                status: dealData[index].status,
                data: dealData[index].history[dealData[index].history.length - 1]
            })
            setSelectedDealIndex(index)
        }
    }


    useEffect(() => {
        setTimeout(() => isLoadedDeal(true), 1500)
    }, [])
    return (<Box __css={{
        maxHeight: ['75vh', '60vh'],
        minHeight: ['75vh', '60vh'],
        width: ['100%', '80%', '60%'],
        display: 'flex'
    }}>
        {selectedDealIndex === -1 && <>
            <Box __css={{display: 'flex'}}>
                <Box as="h3">Seleccione un acuerdo</Box>
                <Box as="button" onClick={e => openMaker(e, -1)}>Nuevo acuerdo</Box>
            </Box>
            <Box>
                <Box as="input"/>
                <Box as="button">Limpiar</Box>
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
