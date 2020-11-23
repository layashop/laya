import React from 'react'
import Modal, {useModal} from '../utils/Modal'
import {Box} from 'theme-ui'
import _ from 'lodash'
import getCookie from "../utils/getCookies";

const printDeal = () => {
    window.print()
}

const currencyOptions = {1: "C$", 2: "$"}

const productPriceOptions = {true: 'Por precio unitario', false: 'Por precio total'}

const dateOptions = {
    4: 'Fecha máxima de reserva',
    5: 'Fecha máxima de entrega',
    6: 'Fecha máxima de entrega',
    7: 'Fecha entregado',
    8: 'Fecha devuelto',
}

const deliveryOptions = {
    1: 'Entrega a domicilio',
    2: 'Pick-up',
    3: 'Punto de encuentro'
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


const DealItem = ({deal}) => {

    const lastEntry = {...deal.history[deal.history.length - 1]}
    const sender = IS_USER ? 1 : 2

    console.log(deal)

    const buildEntry = (entry, isPending = false) => {
        let subtotal = 0
        let condition
        if (!isPending) {
            condition = entry.pending !== 'pending'
        }
        else {
            condition = entry.pending === 'pending'
        }
        return (<Box>
            {condition && (<Box>
                <Box>Estado: {choices[entry.originalStatus]}</Box>
                <Box>
                    <Box>Enviado el {entry.originalSendDate}</Box>
                    <Box>Enviado
                        por {entry.sent_by === 1 ? USER.name || USER.username : deal.business.name}</Box>
                    <Box>Forma de entrega: {deliveryOptions[entry.deliveryMethod]}</Box>
                    <Box>Detalle de productos</Box>
                    <Box>
                        {entry.products.map(product => {
                            console.log(subtotal)
                            subtotal += product.isUnitPrice ? Number.parseFloat(product.price * product.quantity) : Number.parseFloat(product.price)
                            return (<Box>
                                <Box>Artículo: {product.title}</Box>
                                <Box>Forma de calcular
                                    precio: {productPriceOptions[product.isUnitPrice.toString()]}</Box>
                                <Box>
                                    <Box>Cantidad: {product.quantity}</Box>
                                    {product.isUnitPrice && <Box>Precio
                                        Unitario: {currencyOptions[entry.currency]} {product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Box>}
                                    <Box>Precio total: {currencyOptions[entry.currency]} {product.isUnitPrice
                                        ? (product.price * product.quantity).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                        : product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                    </Box>
                                </Box>
                            </Box>)
                        })}
                    </Box>
                    <Box>Subtotal: {currencyOptions[entry.currency]} {subtotal.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Box>
                    {entry.promo && <Box>Promoción: {entry.promo}</Box>}
                    <Box>{dateOptions[entry.originalStatus]}: {entry.date}</Box>
                    {entry.deliveryInstructions && <Box>Instrucciones de delivery: {entry.deliveryInstructions}</Box>}
                    {entry.returnPolicy && <Box>Política de retorno: {entry.returnPolicy}</Box>}
                </Box>
            </Box>)}
        </Box>)
    }

    const [show, openModal, handleOk, handleCancel] = useModal()


    // Id del Acuerdo , Mostrar el Usuario o el Business, Estado
    return (<>
        <Box __css={{pb: '5px', fontSize: '18px', display: 'flex', alignItems: 'center', cursor: 'pointer'}}
             id={`deal-${deal.id}`} onClick={openModal}>
            <Box __css={{
                bg: '#100233',
                p: '5px',
                fontWeight: 'bold',
                color: 'white',
                borderRadius: '5px',
                mr: '20px'
            }}>{`#${_.padStart(deal.id, 7, '0')}`}</Box>
            <Box
                __css={{width: 300}}>{IS_USER ? `${(deal.business.name)}` : `${(deal.user.name || deal.user.username)}`}</Box>

        </Box>
        <Modal
            printable
            show={show}
            onOk={handleOk}
            onCancel={handleCancel}
            title={`Acuerdo #${_.padStart(deal.id, 7, '0')}`}
            subtitle={IS_USER ? `Con negocio: ${deal.business.name}` : `Con usuario: ${USER.username}`}
            onOkButton={
                <button
                    className='w-4/12 text-teal-600 bg-white  hover:text-teal-500 m-1 px-3 py-1 w-auto transistion-color duration-100 focus:outline-none'
                    onClick={printDeal}>Imprimir</button>
            }
        >
            <Box>
                <h3>Creado el {deal.created_at}</h3>
                <h3>Estado actual: {choices[deal.status]}</h3>
                {deal.history.map(buildEntry)}
                {lastEntry.pending === 'pending' && lastEntry.sent_by !== sender && (<Box>
                    <Box>Solicitud pendiente</Box>
                    {buildEntry(lastEntry, true)}
                    <Box>
                        <Box as="button" onClick={e => {
                            e.preventDefault()
                            const newDeal = {...deal}
                            delete newDeal.id

                            newDeal.status = lastEntry.originalStatus
                            newDeal.expires_at = null

                            if(typeof newDeal.user === 'object') {
                                newDeal.user = newDeal.user.id
                            }
                            if(typeof newDeal.business === 'object') {
                                newDeal.business = newDeal.business.id
                            }

                            const history = [...newDeal.history].slice(0, -1)

                            lastEntry.pending = 'no'
                            lastEntry.accepted_at = new Date()

                            history.push(lastEntry)
                            newDeal.history = history

                            fetch(`/api/deals/${deal.id}/`, {
                                method: 'PUT',
                                body: JSON.stringify(newDeal),
                                headers: {
                                    'Content-Type': 'application/json',
                                    "X-CSRFToken": getCookie('csrftoken')
                                }
                            })
                                .then(response => response.json())
                                .then(data => console.log(data))

                        }}>Aceptar</Box>
                        <Box as="button" onClick={e => {
                            e.preventDefault()
                            const newDeal = {...deal}
                            delete newDeal.id

                            newDeal.status = lastEntry.originalStatus
                            newDeal.expires_at = null

                            if(typeof newDeal.user === 'object') {
                                newDeal.user = newDeal.user.id
                            }
                            if(typeof newDeal.business === 'object') {
                                newDeal.business = newDeal.business.id
                            }

                            const history = [...newDeal.history].slice(0, -1)

                            lastEntry.responded_at = new Date()
                            lastEntry.pending = 'no'

                            if(history.length === 0) {
                                newDeal.status = 2
                                history.push(lastEntry)
                            }

                            newDeal.history = history

                            fetch(`/api/deals/${deal.id}/`, {
                                method: 'PUT',
                                body: JSON.stringify(newDeal),
                                headers: {
                                    'Content-Type': 'application/json',
                                    "X-CSRFToken": getCookie('csrftoken')
                                }
                            })
                                .then(response => response.json())
                                .then(data => console.log(data))

                        }}>Rechazar</Box>
                    </Box>
                </Box>)}
                {deal.status === 5 && !IS_USER && <Box>
                    <Box as="button" onClick={e => {
                            e.preventDefault()
                            const newDeal = {...deal}
                            delete newDeal.id

                            const history = [...newDeal.history]

                            newDeal.status = 6
                            newDeal.expires_at = null

                            if(typeof newDeal.user === 'object') {
                                newDeal.user = newDeal.user.id
                            }
                            if(typeof newDeal.business === 'object') {
                                newDeal.business = newDeal.business.id
                            }

                            lastEntry.responded_at = new Date()
                            lastEntry.pending = 'no'
                            lastEntry.originalStatus = 6

                            history.push(lastEntry)

                            newDeal.history = history

                            fetch(`/api/deals/${deal.id}/`, {
                                method: 'PUT',
                                body: JSON.stringify(newDeal),
                                headers: {
                                    'Content-Type': 'application/json',
                                    "X-CSRFToken": getCookie('csrftoken')
                                }
                            })
                                .then(response => response.json())
                                .then(data => console.log(data))

                        }}>Marcar como en delivery</Box>
                    <Box as="button" onClick={e => {
                            e.preventDefault()
                            const newDeal = {...deal}
                            delete newDeal.id
                            const history = [...newDeal.history]

                            newDeal.status = 7
                            newDeal.expires_at = null

                            if(typeof newDeal.user === 'object') {
                                newDeal.user = newDeal.user.id
                            }
                            if(typeof newDeal.business === 'object') {
                                newDeal.business = newDeal.business.id
                            }

                            lastEntry.responded_at = new Date()
                            lastEntry.pending = 'no'
                            lastEntry.originalStatus = 7

                            history.push(lastEntry)

                            newDeal.history = history

                            fetch(`/api/deals/${deal.id}/`, {
                                method: 'PUT',
                                body: JSON.stringify(newDeal),
                                headers: {
                                    'Content-Type': 'application/json',
                                    "X-CSRFToken": getCookie('csrftoken')
                                }
                            })
                                .then(response => response.json())
                                .then(data => console.log(data))

                        }}>Marcar como entregado</Box>
                </Box>}
                {deal.status === 6 && !IS_USER && <Box>
                    <Box as="button" onClick={e => {
                            e.preventDefault()
                            const newDeal = {...deal}
                            delete newDeal.id
                            const history = [...newDeal.history]

                            newDeal.status = 7
                            newDeal.expires_at = null

                            if(typeof newDeal.user === 'object') {
                                newDeal.user = newDeal.user.id
                            }
                            if(typeof newDeal.business === 'object') {
                                newDeal.business = newDeal.business.id
                            }

                            lastEntry.responded_at = new Date()
                            lastEntry.pending = 'no'
                            lastEntry.originalStatus = 7

                            history.push(lastEntry)

                            newDeal.history = history

                            fetch(`/api/deals/${deal.id}/`, {
                                method: 'PUT',
                                body: JSON.stringify(newDeal),
                                headers: {
                                    'Content-Type': 'application/json',
                                    "X-CSRFToken": getCookie('csrftoken')
                                }
                            })
                                .then(response => response.json())
                                .then(data => console.log(data))

                        }}>Marcar como entregado</Box>
                </Box>}
            </Box>

        </Modal>
    </>)
}

export default DealItem
