import React, { useState, useEffect } from "react"
import { Box } from "theme-ui"
import mock from './mock'
import Pagination from "../Pagination";
import baseData from '../SearchWidget/baseData';
import ReactSelector from "react-select"


const estadoList = [
  'Nuevo',
  'Usado',
  'Hecho por Pedido'
]

const PER_PAGE = 24

const convertCurrency = ( source, destination, value, currency) => {
  let converted = value

  if(source !== 'USD') {
    converted = converted / currency[source]?.rate
  }
  if(destination !== 'USD' ) {
    converted = converted * currency[destination]?.rate
  }
  return converted
}

const ResultsWidget = ({ ...props }) => {

  function CurrencyConvert(currencyObj) {
    return Object.keys(currencyObj).map(el=>({value:el, label: `${el} (${currencyObj[el].symbol})`}))
  }

  const currency = null ? true : baseData.currency
  const baseCurrency = {value: 'none', label: 'Todas'}
  const currencyParam = new URLSearchParams(window.location.search).get('currency')
  const currencyOptions = CurrencyConvert(currency)
  const products = PRODUCTS ? PRODUCTS : mock.products
  const total = null ? true : mock.total
  const page = Number.parseInt(window.location.href.match(/&page=\d+$/) ? window.location.href.match(/&page=\d+$/)[0].split('=')[1] : '1')
  const lastPage = Math.ceil(total / 24)
  const baseURL = window.location.href.replace(/&page=\d+$/, '')
  const formatPrice = (num) => (Math.round(num * 100) / 100).toFixed(2)
  const calculateDiscount = (num, discount) => num * ( 1 - discount / 100)
  const [selectedCurrency, setSelectedCurrency] = useState(currencyParam && currency[currencyParam] ? {value: currencyParam, label: `${currencyParam} (${currency[currencyParam]?.symbol})`} : baseCurrency)

  currencyOptions.unshift(baseCurrency)

  return (
    <Box {...props}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mx: 'small', mt: 'medium', color: 'buttonText' }}><span>{`Resultados ${PER_PAGE * (page - 1) + 1} - ${PER_PAGE * page > total ? total : PER_PAGE * page}`}</span><span>Total de resultados: {total}</span></Box>
      <Box sx={{mx: 'small', display: 'flex', alignItems:'center', '> div:last-of-type': {width: '10%'}}}><Box sx={{color: '#557', mr: 'xsmall'}}>Moneda:</Box><ReactSelector options={currencyOptions} value={selectedCurrency} onChange={(value)=>setSelectedCurrency(value)}/></Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: ['repeat(1, 1fr)', 'repeat(2, 1fr)', null, 'repeat(3, 1fr)', 'repeat(4, 1fr)'], width: "100%" }}>
        {products.map((product) => {
          const productCurrency = product.currency || 'NIO'
          const currencySymbol = selectedCurrency.value === 'none' ? currency[productCurrency]?.symbol : currency[selectedCurrency.value]?.symbol
          const productPrice = selectedCurrency.value === 'none' ? product.price : convertCurrency(productCurrency, selectedCurrency.value, product.price, currency)
          return (
            <Box as='a' key={product.id} href={product.link ? product.link : `/${product.id}`} sx={{
              display: 'block',
              position: 'relative',
              m: 'small',
              bg: 'white',
              p: 'small',
              borderRadius: '5px',
              color: 'black',
              textDecoration: 'none',
              lineHeight: 1.2,
              boxShadow: '0px 0px 14px 2px rgba(0,0,0,0.1)',
              '& .label': {
                fontWeight: 'bold'
              },
              '> *': {
                my: 'xsmall',
              }
            }}>
              <Box __css={{ height: '30px' }}>
                {product.new && <Box as='span' __css={{ bg: '#0e77c2', color: 'white', borderRadius: '4px', py: '2px', px: '6px', mr: 'xsmall' }}>Novedad</Box>}
                {product.promotion && <Box as='span' __css={{ bg: '#7a0ec2', color: 'white', borderRadius: '4px', py: '2px', px: '6px' }}>Promoción</Box>}
              </Box>
              <Box as="img" alt={product.title} src={product.thumbnail} sx={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
              <Box as="h2" sx={{ fontSize: 20, height: '2.4em', overflow: 'hidden', my: 'xsmall' }}>{product.title}</Box>
              <Box as="p" sx={{
                color: '#555'
              }}>
                <span className="label">Calificación: </span> {product.score || 0.0} estrellas
              </Box>
              <Box as="p" sx={{
                color: '#555'
              }}>
                <span className="label">Precio: </span>
                <Box as="span" __css={{ textDecoration: product.discount > 0 ? 'line-through' : 'none' }}>{currencySymbol}{formatPrice(productPrice)}</Box>
                {product.discount > 0 && <Box as="span" __css={{ color: '#d1271b' }}> {currencySymbol}{formatPrice(calculateDiscount(productPrice, product.discount))}</Box>}
              </Box>
              <Box as="p" sx={{
                color: '#555'
              }}>
                <span className="label">Estado: </span> {estadoList[product.state]}
              </Box>
              <Box as="p" sx={{ color: '#557', fontSize: 14, mt: 'small' }}>Por {product.user} </Box>
              {product.discount > 0 && <Box sx={{ display: 'flex', boxShadow: '0px 0px 14px 2px rgba(0,0,0,0.2)', justifyContent: 'center', transform: 'rotate(20deg)', alignItems: 'center', position: 'absolute', top: 10, right: 10, borderRadius: '50%', border: '4px solid white', bg: '#d1271b', color: '#fff', width: 60, fontSize: 20, height: 60 }}>
                -{product.discount}%
                </Box>}
            </Box>
          )
        })}

      </Box>
    <Pagination currentPage={page} linkQuantity={3} lastPage={lastPage} link={baseURL} />
    </Box >
  )
}

export default ResultsWidget
