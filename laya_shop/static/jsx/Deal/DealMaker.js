import React, {useState, useEffect} from 'react'
import {Box} from 'theme-ui'
import ReactSelect from 'react-select'
import _ from 'lodash'
import PostSelector from "../PostSelector/PostSelector";
import DayPicker from "react-day-picker";
import 'react-day-picker/lib/style.css';

const CURRENCIES =  JSON.parse(document.getElementById("currencies").innerHTML)

const currencyOptions = CURRENCIES.map(el=> {
    return {value: el.id, label: el.name, symbol: el.symbol}
})

const productPriceOptions = [{value: true, label: 'Por Precio Unitario'}, {value: false, label: 'Por Precio Total'}]

const deliveryOptions = [
    {value: 1, label: 'Entrega a domicilio'},
    {value: 2, label: 'Pick-up'},
    {value: 3, label: 'Punto de encuentro'},
]

const statusOptions = [
    {value: 4, label: "Reservado"},
    {value: 5, label: "Acordado"},
]

const DealMaker = ({activeDeal, isNew, setActiveDeal, isLoadedPost, postData, selectedPost, setSelectedPost, onSubmit, isBusiness}) => {


    console.log(activeDeal)
    const enableSubmit = selectedPost.length > 0
    let subTotal = 0

    useEffect(() => {
        const products = activeDeal.products ? [...activeDeal.products] : []
        for (let product of products) {
            const productData = _.find(postData, {id: product.id})
            product.title = productData.title
            product.thumbnail = productData.images[0].sizes['200x200']
        }
        setActiveDeal({...activeDeal, products: products})
    }, [])

    useEffect(() => {
            selectedPost.forEach(post => {
                    const products = activeDeal.products ? [...activeDeal.products] : []

                    const foundIndex = _.findIndex(products, {id: post.id})

                    if (foundIndex === -1) {

                        let convertedPrice = post.final_price

                        if (post.currency.id !== 1 ) {
                            convertedPrice = convertedPrice * _.find(CURRENCIES, {id: post.currency.id}).rate
                        }
                        if (activeDeal.currency !== 1) {
                            convertedPrice = convertedPrice / _.find(CURRENCIES, {id: activeDeal.currency}).rate
                        }

                        convertedPrice.toFixed(2)

                        // if (post.currency.id === activeDeal.currency) {
                        //     convertedPrice = post.final_price
                        // } else {
                        //     ////// HARDCODEDDDDDDD
                        //     if (post.currency.id === 1) {
                        //         convertedPrice = (post.final_price / 34.65).toFixed(2)
                        //     } else {
                        //         convertedPrice = (post.final_price * 34.65).toFixed(2)
                        //     }
                        // }
                        setActiveDeal({
                            ...activeDeal,
                            products: [...products, {
                                id: post.id,
                                title: post.title,
                                thumbnail: post.images[0].sizes['200x200'],
                                price: convertedPrice,
                                isUnitPrice: true,
                                quantity: 1
                            }
                            ]
                        })
                    }
                }
            )
        }, [selectedPost]
    )

    return (
        <Box __css={{
            overflowY: 'auto',
            label: {px: '30px', my: '10px', display: 'block'},
            textarea: {border: '1px solid #ccc', p: '4px', borderRadius: '5px', width: '100%'}
        }}>
            <Box __css={{
                display: 'flex', justifyContent: 'space-between', width: '100%', pb: '12px',
                mt: '16px',
                px: '30px',
                fontSize: '30px',
                borderBottom: '2px solid rgba(66, 153, 225, 0.5)'
            }}>
                <Box __css={{fontSize: '30px'}}
                     as="h3">{isNew ? 'Crear un nuevo acuerdo' : `Modificar acuerdo #${_.padStart(activeDeal.id, 7, '0')}`}</Box>
            </Box>
            <Box as="label">
                <Box as="span" __css={{fontWeight: 'bold', fontSize: '18px'}}>Seleccione el tipo de acuerdo</Box>
                <ReactSelect options={statusOptions} value={_.find(statusOptions, {value: activeDeal.status})}
                             onChange={e => setActiveDeal({...activeDeal, status: e.value})}/>
            </Box>

            <Box as="label">
                <Box as="span" __css={{fontWeight: 'bold', fontSize: '18px'}}>Moneda</Box>
                <ReactSelect options={currencyOptions} value={_.find(currencyOptions, {value: activeDeal.currency})}
                             onChange={e => {
                                 const products = [...activeDeal.products]

                                 products.forEach((currentVal, i) => {
                                     // HARDCODED

                                       let convertedPrice = products[i].price

                        if (e.value !== 1 ) {
                            convertedPrice = convertedPrice * _.find(CURRENCIES, {id: e.value}).rate
                        }
                        if (activeDeal.currency !== 1) {
                            convertedPrice = convertedPrice / _.find(CURRENCIES, {id: activeDeal.currency}).rate
                        }

                        products[i].price = convertedPrice.toFixed(2)

                                     //
                                     // if (e.value === 2) {
                                     //     products[i].price = (currentVal.price / 34.65).toFixed(2)
                                     // } else {
                                     //     products[i].price = (currentVal.price * 34.65).toFixed(2)
                                     // }

                                 })
                                 setActiveDeal({...activeDeal, currency: e.value, products: products})
                             }}/>


            </Box>
            <Box as="label" __css={{fontWeight: 'bold', fontSize: '18px'}}><Box as="h3">Seleccione los
                productos</Box></Box>
            <PostSelector data={postData} isLoaded={isLoadedPost} selected={selectedPost} setSelected={setSelectedPost}
                          isEmbedded/>
            <Box as="label" __css={{fontWeight: 'bold', fontSize: '18px'}}><Box as="h3">Detalle de producto</Box></Box>
            {selectedPost.length > 0 ? <> {selectedPost.map(((post) => {
                const products = [...activeDeal.products]
                const productIndex = _.findIndex(products, {id: post.id})
                const product = activeDeal.products[productIndex]
                if (productIndex === -1) {
                    return <React.Fragment key={productIndex}/>
                }

                if (product.isUnitPrice) {
                    subTotal += Number.parseFloat((product.quantity * product.price).toFixed(2))
                } else {
                    subTotal += Number.parseFloat((Number.parseFloat(product.price)).toFixed(2))
                }


                return (
                    <Box __css={{
                        py: '5px',
                        borderTop: '1px solid',
                        borderBottom: '1px solid',
                        borderColor: '#ccc',
                        'input, textarea': {border: '1px solid #ccc', p: '4px', borderRadius: '5px'}
                    }}
                         key={product.id}>
                        <Box __css={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            '> *': {flex: 1},
                            h3: {fontSize: '0.8em', fontWeight: 'bold'}
                        }}
                        >
                            <Box as="label"> <Box as="h3">Nombre:</Box>
                                <Box __css={{
                                    lineClamp: 3,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden'
                                }}>{product.title}</Box></Box>
                            <Box as="label">
                                <Box as="h3">Tipo de precio</Box>
                                <ReactSelect options={productPriceOptions}
                                             value={_.find(productPriceOptions, {value: product.isUnitPrice})}
                                             onChange={e => {
                                                 product.isUnitPrice = e.value
                                                 products[productIndex] = product
                                                 setActiveDeal({...activeDeal, products: products})
                                             }}/>
                            </Box>
                            <Box as="label">
                                <Box
                                    as="h3">{product.isUnitPrice ? 'Precio Unitario' : 'Precio Total'} en {_.find(currencyOptions, {value: activeDeal.currency}).symbol}</Box>
                                <Box as="input" value={product.price}
                                     onBlur={(e) => {
                                         product.price = Number.parseFloat(e.target.value).toFixed(2)
                                         products[productIndex] = product
                                         setActiveDeal({...activeDeal, products: products})
                                     }}

                                     onChange={(e) => {
                                         if (!/^\d*(\.\d{0,2})?$/.test(e.target.value)) {
                                             return
                                         }

                                         if (e.target.value === '') {
                                             product.price = '0'
                                         } else {
                                             product.price = e.target.value.replace(/^0(?=)+/, '')
                                             if (product.price === '') {
                                                 product.price = '0'
                                             }
                                         }

                                         products[productIndex] = product
                                         setActiveDeal({...activeDeal, products: products})
                                     }}/>
                            </Box>
                            <Box as="label">
                                <Box as="h3">Cantidad</Box>
                                <Box as="input" value={product.quantity} onChange={(e) => {
                                    if (!/^\d*$/.test(e.target.value)) {
                                        return
                                    }

                                    if (e.target.value === '') {
                                        product.quantity = '0'
                                    } else {
                                        product.quantity = e.target.value.replace(/^0+/, '')
                                        if (product.quantity === '') {
                                            product.quantity = '0'
                                        }
                                    }
                                    products[productIndex] = product
                                    setActiveDeal({...activeDeal, products: products})
                                }}/>
                            </Box>
                            {product.isUnitPrice &&
                            (<Box as="label">
                                <Box as="h3">Precio Total en {_.find(currencyOptions, {value: activeDeal.currency}).symbol}</Box>
                                <Box as="input" readOnly value={(product.price * product.quantity).toFixed(2)}/>
                            </Box>)}
                        </Box>
                        <Box __css={{px: '30px', width: '100%'}}>
                            <Box as="h3" __css={{fontSize: '0.8em', fontWeight: 'bold'}}>Nota</Box>
                            <Box as="textarea" __css={{width: '100%'}} value={product.note} onChange={(e) => {
                                product.note = e.target.value
                                products[productIndex] = product
                                setActiveDeal({...activeDeal, products: products})
                            }}/>
                        </Box>
                    </Box>
                )
            }))}
                <Box
                    __css={{
                        display: 'flex',
                        px: '30px',
                        py: '10px',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        fontSize: '18px'
                    }}>
                    <Box><Box as="span"
                              __css={{fontWeight: 'bold'}}>Subtotal:</Box>
                    </Box> <Box as="span" __css={{
                    width: '150px',
                    textAlign: 'right'
                }}>{_.find(currencyOptions, {value: activeDeal.currency}).symbol} {subTotal.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Box>
                </Box>
            </> : <Box __css={{textDecoration: 'underline', px: '30px'}}>Seleccione un producto de la lista de
                arriba</Box>}
            <Box as="label">
                <Box as="h3" __css={{fontWeight: 'bold', fontSize: '18px'}}>
                    {activeDeal.status === 4 && 'Fecha máxima de reserva'}
                    {activeDeal.status === 5 && 'Fecha máxima de entrega'}
                </Box>
                <DayPicker selectedDays={activeDeal.date} disabledDays={[{before: new Date()}]}
                           onDayClick={(day, {disabled}) => {
                               if (!disabled) {
                                   setActiveDeal({...activeDeal, date: day})
                               }
                           }}/>
            </Box>
            <Box as="label">
                <Box as="h3" __css={{fontWeight: 'bold', fontSize: '18px'}}>Método de entrega</Box>
                <ReactSelect options={deliveryOptions}
                             value={_.find(deliveryOptions, {value: activeDeal.deliveryMethod})}
                             onChange={e => setActiveDeal({...activeDeal, deliveryMethod: e.value})}/>
            </Box>
            <Box as="label">
                <Box as="h3" __css={{fontWeight: 'bold', fontSize: '18px'}}>Instrucciones de entrega</Box>
                <Box as="textarea" value={activeDeal.deliveryInstructions}
                     rows="3"
                     onChange={e => setActiveDeal({...activeDeal, deliveryInstructions: e.target.value})}/>
            </Box>
            <Box as="label">
                <Box as="h3" __css={{fontWeight: 'bold', fontSize: '18px'}}>Promoción</Box>
                <Box as="textarea" value={activeDeal.promo}
                     onChange={e => setActiveDeal({...activeDeal, promo: e.target.value})}/>
            </Box>
            <Box as="label">
                <Box as="h3" __css={{fontWeight: 'bold', fontSize: '18px'}}>Política de reembolso</Box>
                <Box as="textarea" value={activeDeal.returnPolicy}
                     rows="3"
                     onChange={e => setActiveDeal({...activeDeal, returnPolicy: e.target.value})}/>
            </Box>
            <Box __css={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems:'center',
                borderBottomLeftRadius: '10px',
                borderBottomRightRadius: '10px',
                mb: '15px',
                         mr: '30px',
            }}>
                {activeDeal.hasOwnProperty("id") && <Box __css={{mr: '10px'}}>Si hay una petición anterior, será sobreescrita</Box>}
                <Box as="button"
                     onClick={(e) => {
                         if (enableSubmit) {
                             onSubmit(e)
                         }
                     }}
                     __css={{
                         bg: enableSubmit ? '#3473d9' : '#d9d9d9',
                         color: enableSubmit ? 'white' : 'black',
                         transition: '0.5s',
                         cursor: enableSubmit ? 'pointer' : 'not-allowed',
                         px: '20px',
                         py: '5px',
                         borderRadius: '5px'
                     }}>
                    Enviar
                </Box>
            </Box>
        </Box>
    )

}

export default DealMaker
