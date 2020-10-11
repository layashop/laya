import React, {Fragment, useState, useEffect} from 'react'
import ReactDOM from 'react-dom'
import baseData from "./SearchPageWidget/SearchWidget/baseData"
import {Box} from "theme-ui"
import ReactSelector from "react-select"
import CreatableSelect from "react-select/creatable"
import OptionalParameters from "./DashboardPostSelectCategory/OptionalParameters";

const categoryDict = {}
const subcategoryDict = {}

const baseSubCat = { label: "Seleccione un departamento", value: -1 }
const baseCat = { label: "Seleccione una categoría", value: -1, subcat: [] }

const CategoryConvert = (catArray) => {
    return catArray.map(element => {
        categoryDict[element.id] = element.name
        element.subcategories.forEach(el=>subcategoryDict[el.id]=el.name)
        return { label: element.name, value: element.id, subcat: element.subcategories }
    })
  }

const catOptions = CATEGORIES ? CategoryConvert(CATEGORIES) : baseData.categories.map((element) => {
    return { label: element.name, value: element.id, subcat: element.subcategories }
})

catOptions.unshift(baseCat)

const defaultTags = undefined ? console.log('xd') : []


const DashboardPostSelectCategory = () => {

  // AQUI WEON BUSCA

  const defaultCategory =  baseCat
  const [selectedCat, setSelectedCat] = useState(defaultCategory)

  const subcat = defaultCategory.subcat.map(el => {
    return { value: el.id, label: el.name }
  })

  subcat.unshift(baseSubCat)

  const defaultSubCat = baseSubCat
  const [selectedSubCat, setSelectedSubCat] = useState(defaultSubCat || baseSubCat)
  const [isDisabledSubCat, setIsDisabledSubCat] = useState(true)
  const [subCatOptions, setSubCatOptions] = useState(defaultSubCat ? subcat : [baseSubCat])
  const [selectedSubcatList, setSelectedSubcatList] = useState(SELECTED_SUBCATEGORIES || [])

  const removeSubCat = (id) => {
      setSelectedSubcatList(selectedSubcatList.filter(element => element.id != id))
  }

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
    if (element.value !== -1) {
        if(!selectedSubcatList.some(el=>el.id === element.value)) {
            setSelectedSubcatList([...selectedSubcatList, {id: element.value, category: selectedCat.value }])
        }
    }
  }


  return (
      <Box __css={{ '& label': { my: 'xsmall', display: 'block' } }}>
         <h3 className="mb-4 block uppercase tracking-wide text-gray-700 text-md font-bold">Categorizacion</h3>
          <label>
          <span className="mb-2 block uppercase tracking-wide text-gray-700 text-xs font-bold">Departamento</span>
          <ReactSelector
                  name="category"
                  options={catOptions}
                  defaultValue={defaultCategory}
                  onChange={handleCatChange}
                  isClearable={false}
                />
          </label>
          <label>
              <span className="mb-2 mt-2 block uppercase tracking-wide text-gray-700 text-xs font-bold">Categoría</span>
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
          <span className="mb-2 mt-2 block uppercase tracking-wide text-gray-700 text-xs font-bold">Selecciones</span>
          <Box __css={{height: '200px', overflowY: 'scroll'}}>
          {
              selectedSubcatList.map((element)=> {
                      return (
                          <div
                              className="text-md my-2 mx-2 flex bg-blue-200 text-blue-700 rounded cursor-pointer py-1 px-2 align-middle hover:bg-red-400"
                          onClick={() => {removeSubCat(element.id)}}>
                              <span
                                  className="text-sm font-medium">{categoryDict[element.category]}: {subcategoryDict[element.id]}</span>
                          </div>
                      )
                  }
              )
          }
          </Box>
          <label>
              <span className="mb-2 mt-2 block uppercase tracking-wide text-gray-700 text-xs font-bold">Etiquetas</span>
              <CreatableSelect
              name="tags"
              isMulti
              defaultValue={defaultTags}
              noOptionsMessage={() => 'Agregar etiquetas'}
              formatCreateLabel={(value) => `Agregar "${value}"`}
              placeholder="Agregue etiquetas"
            />

          </label>
          <Box __css={{maxHeight: '800px', overflowY: 'auto'}}>
            <h3 className="mb-4 pt-4 block uppercase tracking-wide text-gray-700 text-md font-bold">Parametros Adicionales</h3>
            <OptionalParameters/>
          </Box>

    </Box>
  )
}

/*const categoryOptions = CATEGORIES.map(element =>  ({
    value: element.id,
    label: element.name,
    subcategories: element.subcategories
}))



function Hola(){
    const [category, setCategory] = useState([])
    const [showSubCatSelect, setShowSubCatSelect] = useState(false)
    const [selectedSubcategories, setSelectedSubcategories] = useState([])
    const [subCatOptions, setSubCatOptions ] = useState([])
    const [subCatSelectText, setSubCatSelectText] = useState(null)



    //Convierte un objeto {id, name, ...} a {label, value, ....}
    function subCatToSelect(subCat){
        return {
            ...subCat,
            label: subCat.name,
            value: subCat.id
        }
    }
    useEffect(() => {
        if (typeof SELECTED_SUBCATEGORIES != 'undefined'){
            //iteramos sobre la lista de todas las subcategorias y por cada elemento miramos si existe en SELECTED_CATEGORIES
            //Si existe, metemos todo el objeto de SUBCATEGORIES correspondiente al ciclo y vamos al siguiente ciclo izi
            let temp = SUBCATEGORIES.filter(element => (SELECTED_SUBCATEGORIES.find(subCat => element.id == subCat.id) ))
            //Luego agarramos las subcategorias que hicieron match y las convertimos en react-select friendly

            temp = temp.map(element => subCatToSelect(element))
            setSelectedSubcategories(temp)
        }
    }, [])

    function handleCategory(option){
        setCategory(option)
        let temp =  option.subcategories.filter(element => !selectedSubcategories.find(subCat => subCat.id == element.id)).map(element => subCatToSelect(element))
        setSubCatOptions(temp)
        if(temp.length > 0){
            setShowSubCatSelect(true)
        }else{
            setShowSubCatSelect(false)
        }
    }
    function removeSubCat(id){
        setSelectedSubcategories(selectedSubcategories.filter(element => element.id != id))
    }
    function reEvaluateSubCat(){
        setSubCatOptions()
    }
    function addSubcategory(option){
        if (selectedSubcategories.indexOf(option) == -1){
            let newSubCatOptions = subCatOptions.filter(element => element.id != option.id)
            setSubCatSelectText(option.label)
            setSubCatOptions(newSubCatOptions)

            setSelectedSubcategories([...selectedSubcategories, option])
            if (newSubCatOptions.length === 0){
                setSubCatSelectText(null)
            }
        }
    }

    return(
        <div className="">

            <h3 className="mb-4 block uppercase tracking-wide text-gray-700 text-md font-bold">Categorizacion</h3>

            {selectedSubcategories.map(element => <input name="subcategories" value={element.value} hidden={true} readOnly/>)}
            <h3 className="mb-2 block uppercase tracking-wide text-gray-700 text-xs font-bold">Departamento</h3>
            <Select options={categoryOptions} onChange={handleCategory} name="category" placeholder="Buscar departamento" className="mb-3"/>

            {showSubCatSelect ?
                <Fragment>
                    <h3 className="mb-2 block uppercase tracking-wide text-gray-700 text-xs font-bold">Categoria</h3>
                    <Select
                        options={subCatOptions}
                        onChange={addSubcategory}
                        name="subcategory"
                        placeholder="Selecciona una subcategoria" />
                </Fragment>
            : null}
            <div className="mt-4 flex flex-wrap">
                {selectedSubcategories.map(element => {
                    return (
                        <div className="text-md my-2 mx-2 flex bg-blue-200 text-blue-700 rounded py-1 px-2   align-middle">
                            <span className="text-sm font-medium">{element.label} </span>
                            <span className="ml-2 text-white cursor-pointer" onClick={() => {removeSubCat(element.id)}}> X</span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}*/

let widget = document.getElementById('category-select')

ReactDOM.render( <DashboardPostSelectCategory /> , widget)
