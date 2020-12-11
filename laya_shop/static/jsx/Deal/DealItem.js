import React, {useState} from 'react'
import Modal, {useModal} from '../utils/Modal'
import {Box} from 'theme-ui'
import _ from 'lodash'
import getCookie from "../utils/getCookies";
import statusChoices from "./statusChoices";
import Tag from "./Tag";
import Chevron from "./Chevron";
import IconResolver from "../ChatWidget/IconResolver";
import StarHandler from "./StarHandler";

const printDeal = () => {
    window.print()
}

const printDate = (dateString, showTime = true) => {
    const date = new Date(dateString)
    return `${_.padStart(date.getDate(), 2, '0')}/${_.padStart(date.getMonth(), 2, '0')}/${date.getFullYear()} ${showTime ? `${_.padStart(date.getHours(), 2, '0')}:${_.padStart(date.getMinutes(), 2, '0')}` : ''}`
}

const currencyOptions = {1: {symbol: "C$", name: 'Córdobas'}, 2: {symbol: "$", name: 'Dólares'}}

const productPriceOptions = {true: 'Por precio unitario', false: 'Por precio total'}

const dateOptions = {
    3: 'Fecha original de entrega/reserva',
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
}

JSON.parse(document.getElementById("currencies").innerHTML).forEach(({symbol, name, id})=> {
    currencyOptions[id] = {
        symbol,
        name
    }
})

const DealItem = ({deal, show, handleUpdateData, handleOpenItem}) => {

    const lastEntry = {...deal.history[deal.history.length - 1]}
    const sender = IS_USER ? 1 : 2
    const [reason, setReason] = useState('')

    const [showEntry, setShowEntry] = useState({})


    const buildEntry = (entry, index, isPending = false) => {
        let subtotal = 0
        let condition
        if (!isPending) {
            condition = entry.pending !== 'pending'
        } else {
            condition = entry.pending === 'pending'
        }
        return (<>
            {condition && (
                <Box>
                    <Box
                        onClick={() => setShowEntry({...showEntry, [index]: !showEntry[index]})}
                        __css={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            fontSize: '20px',
                            p: '10px',
                            borderBottom: '1px solid #63b3ed',

                        }}>
                        <Box __css={{display: 'flex', alignItems: 'center', flex: 1}}><Tag
                            color={statusChoices[entry.originalStatus].mainColor}>{statusChoices[entry.originalStatus].name}</Tag></Box>
                        <Box>Enviado el {printDate(entry.originalSendDate)}</Box>
                        <Chevron show={showEntry[index]}/>
                    </Box>
                    <Box __css={{display: showEntry[index] ? 'block' : 'none', pt: '10px'}}>
                        <Box
                            __css={{display: entry.originalStatus === 3 || entry.originalStatus === 8 || deal.status === 3 || deal.status === 8 ? '' : 'none'}}>
                            <Box as="span" __css={{fontWeight: 'bold', bg: "#f7f5be"}}>Razón de
                                {showEntry[entry.originalStatus] === 3 ? " cancelación" : " devolución"}:</Box> {entry.reason}
                        </Box>
                        <Box>
                            <Box as="span" __css={{fontWeight: 'bold'}}>Forma de
                                entrega:</Box> {deliveryOptions[entry.deliveryMethod]}
                        </Box>
                        <Box><Box as="span"
                                  __css={{fontWeight: 'bold'}}>{dateOptions[entry.originalStatus]}:</Box> {printDate(entry.date, false)}
                        </Box>
                        <Box>
                            <Box as="span"
                                 __css={{fontWeight: 'bold'}}>Moneda:</Box> {currencyOptions[entry.currency].name} ({currencyOptions[entry.currency].symbol})
                        </Box>
                        <Box __css={{fontWeight: 'bold', mt: '10px', textDecoration: 'underline'}}>Detalle de
                            productos</Box>
                        <Box>
                            {entry.products.map(product => {
                                subtotal += product.isUnitPrice ? Number.parseFloat(product.price * product.quantity) : Number.parseFloat(product.price)
                                return (
                                    <Box __css={{display: 'flex', px: '20px', mb: '20px'}}>
                                        <Box __css={{flex: 1}}>
                                            <Box><Box as="span"
                                                      __css={{fontWeight: 'bold'}}>Artículo:</Box> {product.title}</Box>
                                            <Box><Box as="span" __css={{fontWeight: 'bold'}}>Forma de calcular
                                                precio:</Box> {productPriceOptions[product.isUnitPrice.toString()]}
                                            </Box>
                                            <Box><Box as="span"
                                                      __css={{fontWeight: 'bold'}}>Cantidad:</Box> {product.quantity}
                                            </Box>
                                            {product.isUnitPrice && <Box><Box as="span" __css={{fontWeight: 'bold'}}>Precio
                                                Unitario:</Box> {currencyOptions[entry.currency].symbol} {product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                            </Box>}
                                            {product.note && <Box><Box as="span"
                                                                       __css={{fontWeight: 'bold'}}>Nota:</Box> {product.note}
                                            </Box>}
                                        </Box>
                                        <Box>Precio: {currencyOptions[entry.currency].symbol} {product.isUnitPrice
                                            ? (product.price * product.quantity).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                            : product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </Box>
                                    </Box>)
                            })}
                        </Box>
                        <Box __css={{textAlign: 'right', px: '20px'}}><Box as="span" __css={{
                            borderTop: '1px solid #aaa',
                            pt: '4px',
                            pl: '8px'
                        }}>Subtotal: {currencyOptions[entry.currency].symbol} {subtotal.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Box></Box>
                        {entry.promo &&
                        <Box><Box __css={{fontWeight: 'bold'}}>Promoción:</Box> {entry.promo}</Box>}
                        {entry.deliveryInstructions &&
                        <Box><Box __css={{fontWeight: 'bold'}}>Instrucciones de
                            delivery:</Box> {entry.deliveryInstructions}</Box>}
                        {entry.returnPolicy &&
                        <Box><Box __css={{fontWeight: 'bold'}}>Política de retorno:</Box> {entry.returnPolicy}
                        </Box>}
                    </Box>
                </Box>)}
        </>)
    }

    const [, openModal, handleOk, handleCancel] = useModal()


    // Id del Acuerdo , Mostrar el Usuario o el Business, Estado
    return (<>
            <Box __css={{pb: '5px', fontSize: '18px', display: 'flex', alignItems: 'center', cursor: 'pointer'}}
                 id={`deal-${deal.id}`} onClick={() => {
                handleOpenItem(deal.id)
            }}>
                <Tag color={statusChoices[deal.status].mainColor}
                     sx={{mr: '20px'}}>{`#${_.padStart(deal.id, 7, '0')}`}</Tag>
                <Box
                    __css={{width: 300}}>{IS_USER ? `${(deal.business.name)}` : `${(deal.user.name || deal.user.username)}`}</Box>

            </Box>
            <Modal
                printable
                show={show}
                onOk={handleOk}
                onCancel={() => handleOpenItem(-1)}
                title={`Acuerdo #${_.padStart(deal.id, 7, '0')}`}
                subtitle={<Box as="a" __css={{':hover': {color: 'black',textDecoration: 'underline',}}}
                               href={IS_USER ? `/profile/${USER.username}/chat/#${deal.business.slug}-${USER.id}` :
                                   `/${BUSINESS.slug}/dashboard/chat#${BUSINESS.slug}-${deal.user.id}`
                               }>
                    {IS_USER ? `Con negocio: ${deal.business.name}` : `Con usuario: ${USER.username}`}
                </Box>}
                onOkButton={
                    <button
                        className='w-4/12 text-teal-600 bg-white  hover:text-teal-500 m-1 px-3 py-1 w-auto transistion-color duration-100 focus:outline-none'
                        onClick={printDeal}>Imprimir</button>
                }
            >
                <Box>
                    <Box __css={{display: 'flex', justifyContent: 'space-between'}}>
                        <Box as="h3" __css={{fontSize: '20px'}}>Creado el {printDate(deal.created_at)}</Box>
                        <Box as="h3" __css={{
                            fontSize: '20px', display: 'flex', alignItems: 'center', fontWeight: 'bold',
                        }}>Estado actual:
                            <Tag color={statusChoices[deal.status].mainColor} sx={{ml: '20px'}}>
                                {statusChoices[deal.status].name}
                            </Tag>
                        </Box>
                    </Box>
                    {deal.history.map((entry, index) => buildEntry(entry, index))}
                    {lastEntry.pending === 'pending' && (<Box>
                        <Box __css={{fontWeight: 'bold', fontSize: '24px', mt: '20px'}}>Solicitud pendiente</Box>
                        {buildEntry(lastEntry, (deal.history.length - 1), true)}
                        {sender !== deal.sent_by && (<Box>
                            <Box as="button" className={'p-2 bg-red-100 hover:shadow-xs rounded-xs'} onClick={e => {
                                e.preventDefault()
                                const newDeal = {...deal}
                                delete newDeal.id

                                newDeal.status = lastEntry.originalStatus
                                newDeal.expires_at = null

                                if (typeof newDeal.user === 'object') {
                                    newDeal.user = newDeal.user.id
                                }
                                if (typeof newDeal.business === 'object') {
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
                                    .then(data => handleUpdateData())

                            }}>Aceptar</Box>
                            <Box as="button" className={'p-2 bg-red-100 hover:shadow-xs rounded-xs'} onClick={e => {
                                e.preventDefault()
                                const newDeal = {...deal}
                                delete newDeal.id

                                if (typeof newDeal.user === 'object') {
                                    newDeal.user = newDeal.user.id
                                }
                                if (typeof newDeal.business === 'object') {
                                    newDeal.business = newDeal.business.id
                                }

                                const history = [...newDeal.history].slice(0, -1)

                                lastEntry.responded_at = new Date()
                                lastEntry.pending = 'no'
                                newDeal.status = history[history.length - 1].originalStatus

                                if (history.length === 0) {
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
                                    .then(data => handleUpdateData())

                            }}>Rechazar</Box>
                        </Box>)}

                    </Box>)}
                    {deal.status === 5 && !IS_USER && <Box>
                        <Box as="button" className={'p-2 bg-red-100 hover:shadow-xs rounded-xs'} onClick={e => {
                            e.preventDefault()
                            const newDeal = {...deal}
                            delete newDeal.id

                            const history = [...newDeal.history]

                            newDeal.status = 6
                            newDeal.expires_at = null

                            if (typeof newDeal.user === 'object') {
                                newDeal.user = newDeal.user.id
                            }
                            if (typeof newDeal.business === 'object') {
                                newDeal.business = newDeal.business.id
                            }

                            lastEntry.originalSendDate = new Date()
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
                                .then(data => handleUpdateData())

                        }}>Marcar como en delivery</Box>
                        <Box as="button" className={'p-2 bg-red-100 hover:shadow-xs rounded-xs'} onClick={e => {
                            e.preventDefault()
                            const newDeal = {...deal}
                            delete newDeal.id
                            const history = [...newDeal.history]

                            newDeal.status = 7
                            newDeal.expires_at = null

                            if (typeof newDeal.user === 'object') {
                                newDeal.user = newDeal.user.id
                            }
                            if (typeof newDeal.business === 'object') {
                                newDeal.business = newDeal.business.id
                            }

                            lastEntry.originalSendDate = new Date()
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
                                .then(data => handleUpdateData())

                        }}>Marcar como entregado</Box>
                    </Box>}
                    {deal.status === 6 && !IS_USER && <Box>
                        <Box as="button" className={'p-2 bg-red-100 hover:shadow-xs rounded-xs'} onClick={e => {
                            e.preventDefault()
                            const newDeal = {...deal}
                            delete newDeal.id
                            const history = [...newDeal.history]

                            newDeal.status = 7
                            newDeal.expires_at = null

                            if (typeof newDeal.user === 'object') {
                                newDeal.user = newDeal.user.id
                            }
                            if (typeof newDeal.business === 'object') {
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
                                .then(data => handleUpdateData())

                        }}>Marcar como entregado</Box>
                    </Box>}
                    {(deal.status === 7 || deal.status === 8) && IS_USER && <Box className="pt-2">
                            <StarHandler deal={deal} handleUpdateData={handleUpdateData} />
                    </Box>}
                    {deal.status === 7 && IS_USER && <Box className="pt-2">
                        <Box as="h3" __css={{fontWeight: 'bold'}}>¿Quieres solicitar una devolución?</Box>
                        <Box as="input" value={reason} onChange={e => setReason(e.target.value)} type="text"
                             className="p-2 w-1/2" placeholder="Escribe una razón" id="reclamo"/>
                        <Box as="button" className={'p-2 bg-red-100 hover:shadow-xs rounded-xs'}
                             __css={{cursor: reason === '' && 'not-allowed'}} onClick={e => {
                            if (reason === '') {
                                return
                            }
                            e.preventDefault()
                            const newDeal = {...deal}
                            delete newDeal.id
                            const history = [...newDeal.history]

                            const lastEntry = {...[...history.slice(-1)][0]}

                            const expires_at = new Date()
                            expires_at.setDate(expires_at.getDate() + 3)

                            newDeal.sent_by = IS_USER ? 1 : 2
                            newDeal.status = 1
                            newDeal.expires_at = expires_at


                            if (typeof newDeal.user === 'object') {
                                newDeal.user = newDeal.user.id
                            }
                            if (typeof newDeal.business === 'object') {
                                newDeal.business = newDeal.business.id
                            }

                            lastEntry.reason = reason
                            lastEntry.originalSendDate = new Date()
                            lastEntry.pending = 'pending'
                            lastEntry.originalStatus = 8

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
                                .then(data => handleUpdateData())

                        }}>Solicitar Devolución</Box>
                    </Box>}
                    {deal.status >= 4 && deal.status <= 6 && <Box className="pt-2">
                        <Box as="h3" __css={{fontWeight: 'bold'}}>¿Quieres solicitar una cancelación?</Box>
                        <Box as="input" value={reason} onChange={e => setReason(e.target.value)} type="text"
                             className="p-2 w-1/2" placeholder="Escribe una razón" id="cancelar"/>
                        <Box as="button" className={'p-2 bg-red-100 hover:shadow-xs rounded-xs'}
                             __css={{cursor: reason === '' && 'not-allowed'}}
                             onClick={e => {
                                 if (reason === '') {
                                     return
                                 }
                                 e.preventDefault()
                                 const newDeal = {...deal}
                                 delete newDeal.id
                                 const history = [...newDeal.history]

                                 const lastEntry = {...[...history.slice(-1)][0]}

                                 const expires_at = new Date()
                                 expires_at.setDate(expires_at.getDate() + 3)

                                 newDeal.sent_by = IS_USER ? 1 : 2
                                 newDeal.status = 1
                                 newDeal.expires_at = expires_at

                                 if (typeof newDeal.user === 'object') {
                                     newDeal.user = newDeal.user.id
                                 }
                                 if (typeof newDeal.business === 'object') {
                                     newDeal.business = newDeal.business.id
                                 }

                                 lastEntry.reason = reason
                                 lastEntry.originalSendDate = new Date()
                                 lastEntry.pending = 'pending'
                                 lastEntry.originalStatus = 3

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
                                     .then(data => handleUpdateData())

                             }}>Solicitar Cancelación</Box>
                    </Box>}
                </Box>

            </Modal>
        </>
    )
}

export default DealItem
