import React, { useState } from "react"
import { Box } from "theme-ui"
import Searchbar from '../Searchbar'
import ReactSelector from "react-select"
import CreatableSelect from 'react-select/creatable'
import baseData from './baseData'

const SearchWidget = ({ ...props }) => {

  const baseSubCat = { label: "Todas las categorías", value: -1 }
  const baseCat = { label: "Todos los departamentos", value: -1, subcat: [] }

  const [hideFilters, setHideFilters] = useState(true)

  const [search, setSearch] = useState('')

  const params = new URLSearchParams(window.location.search)

  // AQUI WEON BUSCA
  function CategoryConvert(catArray){
    return catArray.map(element => ({ label: element.name, value: element.id, subcat: element.subcategories }))
  }

  const catOptions = CATEGORIES ? CategoryConvert(CATEGORIES) : baseData.categories.map((element) => {
    return { label: element.name, value: element.id, subcat: element.subcategories }
  })
  console.log(catOptions)
  const sortOptions = undefined ? true : baseData.sort
  const deliveryOptions = undefined ? true : baseData.delivery
  const stateOptions = undefined ? true : baseData.state

  const defaultCategory = catOptions.filter(val => val.value == params.get('category'))[0] || baseCat
  const [selectedCat, setSelectedCat] = useState(defaultCategory)

  const subcat = defaultCategory.subcat.map(el => {
    return { value: el.id, label: el.name }
  })

  subcat.unshift(baseSubCat)

  const defaultSubCat = subcat.filter(val => val.value == params.get('subcategories'))[0]
  const [selectedSubCat, setSelectedSubCat] = useState(defaultSubCat || baseSubCat)
  const [isDisabledSubCat, setIsDisabledSubCat] = useState(defaultSubCat ? false : true)
  const [subCatOptions, setSubCatOptions] = useState(defaultSubCat ? subcat : [baseSubCat])


  const defaultSort = sortOptions.filter(val => val.value == params.get('sort'))[0] || sortOptions[0]
  const defaultState = stateOptions.filter(val => val.value == params.get('state'))[0] || stateOptions[0]
  const defaultDelivery = deliveryOptions.filter(val => val.value == params.get('delivery'))[0] || deliveryOptions[0]
  const [lowPrice, setLowPrice] = useState(params.get('lowPrice') || '')
  const [highPrice, setHighPrice] = useState(params.get('highPrice') || '')
  const defaultTags = params.getAll('tags').map(val => {
    return { value: val, label: val }
  })



  const handleCatChange = (element) => {
    if (element.value !== selectedCat.value) {
      // change selected category and sub category
      setSelectedCat(element)
      setSelectedSubCat(baseSubCat)

      // disable subcategory if needed
      if (element.value === -1) {
        setIsDisabledSubCat(true)
      }

      //update subcategory options based on category
      else {
        setSubCatOptions([baseSubCat].concat(
          element.subcat.map(el => {
            return { label: el.name, value: el.id }
          })
        ))
        setIsDisabledSubCat(false)
      }
    }
  }

  const handleSubCatChange = (element) => {
    if (element.value !== selectedSubCat.value) {
      setSelectedSubCat(element)
    }
  }

  const handlePrice = (e) => {
    return !isNaN(e.target.value) && e.target.value >= 0
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const form = new FormData(event.target)

    let query = '?'

    if (form.get('search') !== '') {
      query += `search=${form.get('search')}`
    }

    if (form.get('category') !== '-1') {
      query += `category=${form.get('category')}&`
    }

    if (form.get('subcategory') !== '-1' && form.get('subcategory') !== null) {
      query += `subcategory=${form.get('subcategory')}&`
    }

    form.getAll('tags').forEach((value) => {
      if (value !== '') {
        query += `tags=${value}&`
      }
    })

    if (form.get('sort') !== '-1') {
      query += `sort=${form.get('sort')}&`
    }

    if (form.get('state') !== '-1') {
      query += `state=${form.get('state')}&`
    }

    if (form.get('delivery') !== '-1') {
      query += `delivery=${form.get('delivery')}&`
    }

    if (form.get('lowPrice') !== '') {
      query += `lowPrice=${form.get('lowPrice')}&`
    }

    if (form.get('highPrice') !== '') {
      query += `highPrice=${form.get('highPrice')}&`
    }

    if (query.slice(-1) === "&") {
      query = query.slice(0, -1)
    }

    document.location.search = query
  }

  catOptions.unshift(baseCat)

  return (
    <Box __css={{ '& label': { my: 'xsmall', display: 'block' } }}{...props}>
      <form onSubmit={handleSubmit}>
        <Searchbar onChange={setSearch} value={search} />
        <Box as="div" __css={{ display: ['flex', null, 'none'], justifyContent: 'center', mt: 'xsmall' }}><Box as="span" __css={{
          border: '0', color: '#0051b5',
          bg: '#eef', borderRadius: '4px',
          cursor: 'pointer',
          transition: '0.25s', p: 4, ':hover': {
            boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.15)'
          }
        }}
          onClick={() => setHideFilters(!hideFilters)}
        >
          {`${hideFilters ? 'Mostrar' : 'Ocultar'} filtros de búsqueda`}
        </Box>
        </Box>
        <Box __css={{ display: hideFilters ? ['none', null, 'block'] : 'block' }}>
          <label>
            Departamento
      <ReactSelector
              name="category"
              options={catOptions}
              defaultValue={defaultCategory}
              onChange={handleCatChange}
              isClearable={false}
            />
          </label>
          <label>
            Categorías
      <ReactSelector
              name="subcategory"
              options={subCatOptions}
              value={selectedSubCat}
              isDisabled={isDisabledSubCat}
              defaultValue={baseSubCat}
              onChange={handleSubCatChange}
              isClearable={false}
            />
          </label>
          <label>
            Etiquetas
        <CreatableSelect
              name="tags"
              isMulti
              defaultValue={defaultTags}
              noOptionsMessage={() => 'Agregar etiquetas'}
              formatCreateLabel={(value) => `Agregar "${value}"`}
              placeholder="Agregue etiquetas"
            />
          </label>
          <label>
            Ordenar por:
      <ReactSelector
              name='sort'
              options={sortOptions}
              defaultValue={defaultSort}
              isClearable={false}
            />
          </label>
          <label>
            Estado del producto
      <ReactSelector
              name='state'
              options={stateOptions}
              defaultValue={defaultState}
              isClearable={false}
            />
          </label>
          <label>
            Tipo de entrega
      <ReactSelector
              name='delivery'
              options={deliveryOptions}
              defaultValue={defaultDelivery}
              isClearable={false}
            />
          </label>
          <Box __css={{
            '> div': {
              display: 'flex',
              width: '100%'
            },
            '> div *': {
              border: '1px solid #ccc',
              width: 110,
              p: 'xsmall',
              fontSize: '16px',
              lineHeight: 1.5,
              my: 'tiny',
            },
            '> div div': {
              bg: '#eef',
              borderTopLeftRadius: '10px',
              borderBottomLeftRadius: '10px'
            },
            '> div input': {
              borderLeft: '0px',
              borderTopRightRadius: '10px',
              borderBottomRightRadius: '10px',
              flex: 1,
              ':focus': {
                outline: 'none'
              }
            }
          }}>
            Precio en C$:
          <Box>
              <Box>Mayor que: </Box>
              <input type="text"
                name='lowPrice'
                aria-label="Mayor que"
                placeholder='Ingrese un valor'
                onChange={(e) => handlePrice(e) ? setLowPrice(e.target.value) : null}
                value={lowPrice} />
            </Box>
            <Box>
              <Box>Menor que: </Box>
              <input type="text"
                name='highPrice'
                aria-label="Menor que"
                placeholder='Ingrese un valor'
                onChange={(e) => handlePrice(e) ? setHighPrice(e.target.value) : null}
                value={highPrice} />
            </Box>
          </Box>
          <Box __css={{ my: 'small', width: '100%', textAlign: 'center' }}><Box as='input' type='submit' __css={{
            border: '1px solid #ccc', fontSize: 16,
            border: '0', color: '#0051b5',
            bg: '#eef', borderRadius: '4px',
            cursor: 'pointer',
            transition: '0.25s', p: 'xsmall', ':hover': {
              boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.15)'
            }
          }}
            value='Buscar' />
          </Box>
        </Box>
      </form>
    </Box>
  )
}

export default SearchWidget
