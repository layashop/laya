import React, {Fragment, useState, useEffect} from 'react'
import ReactDOM, { render } from 'react-dom'
import Select from 'react-select'


const categoryOptions = CATEGORIES.map(element =>  ({
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
            {/* <span>{category}</span> */}
            <h3 className="mb-4 block uppercase tracking-wide text-gray-700 text-md font-bold">Categorizacion</h3>
            {/*  Inputs hidden  */}
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
}

let widget = document.getElementById('category-select')

ReactDOM.render( <Hola /> , widget)