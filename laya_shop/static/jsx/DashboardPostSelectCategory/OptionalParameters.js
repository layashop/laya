import React, {useState} from "react"
import ReactSelector from "react-select"
import CreatableSelect from "react-select/creatable"
import structure from './structure'

const additionalOpt = []
const SELECTED_ATTRIBUTES = JSON.parse(document.getElementById('selected-attributes').textContent)
const initialSelectedParameters = typeof SELECTED_ATTRIBUTES === 'object' && SELECTED_ATTRIBUTES !== null ? SELECTED_ATTRIBUTES : {}

for( const type in structure ) {
    if (initialSelectedParameters[type] === undefined) {
        additionalOpt.push({value: type, ...structure[type]})
    }
}

const addParameter = ( value, options, setOptions, parameters, setParameters )=> {
    setOptions(options.filter(el=> value.value !== el.value))
    setParameters({...parameters, [value.value]: null})
}

const removeParameter = ( value, options, setOptions, parameters, setParameters )=> {
    const newObject = parameters
    delete newObject[value]
    setOptions([...options, {value: value, ...structure[value]}])
    setParameters(newObject)
}

const BaseString = ({property, value, set, onClick}) => {
    return (
        <label>
            <div className="flex justify-between">
                <span className="mb-2 pt-2 block uppercase tracking-wide text-gray-700 text-xs font-bold">{structure[property].label}</span>
                <span className="mb-2 pt-2 block uppercase tracking-wide text-red-700 text-xs cursor-pointer font-bold"
                      onClick={onClick}
                >Borrar</span>
            </div>
          <input value={value[property] || ''}
                 className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                 onChange={(e)=> set({...value, [property]: e.target.value})} />
        </label>
    )
}

const BaseSetListMulti = ({property, value, set, onClick}) => {
    return (
        <label>
          <div className="flex justify-between">
                <span className="mb-2 pt-2 block uppercase tracking-wide text-gray-700 text-xs font-bold">{structure[property].label}</span>
                <span className="mb-2 pt-2 block uppercase tracking-wide text-red-700 text-xs cursor-pointer font-bold"
                      onClick={onClick}
                >Borrar</span>
            </div>
          <ReactSelector value={value[property] && value[property].map(el=>({value: el, label: el}))||''} isMulti
                         options={structure[property].option.map(element=>({value: element, label: element}))}
                         onChange={(event)=> set({...value, [property]: event ? event.map(el => el.value) : [] })} />
    </label>)
}

const BaseListMulti = ({property, value, set, onClick}) => {
    return (
        <label>
          <div className="flex justify-between">
                <span className="mb-2 pt-2 block uppercase tracking-wide text-gray-700 text-xs font-bold">{structure[property].label}</span>
                <span className="mb-2 pt-2 block uppercase tracking-wide text-red-700 text-xs cursor-pointer font-bold"
                      onClick={onClick}
                >Borrar</span>
            </div>
          <CreatableSelect value={value[property] && value[property].map(el=>({value: el, label: el}))||''} isMulti
                           onChange={(event)=> set({...value, [property]: event ? event.map(el => el.value) : [] })}
                           noOptionsMessage={() => 'Agregar valores'}
                           formatCreateLabel={(value) => `Agregar "${value}"`}
                           placeholder="Agregue valores"/>
    </label>)
}

const BaseMeasure = ({property, value, set, onClick}) => {
    const current = value[property] || {measure: '', unit: ''}
    return (
        <>
            <div className="flex justify-between">
                <span className="mb-2 pt-2 block uppercase tracking-wide text-gray-700 text-xs font-bold">{structure[property].label}</span>
                <span className="mb-2 pt-2 block uppercase tracking-wide text-red-700 text-xs cursor-pointer font-bold"
                      onClick={onClick}
                >Borrar</span>
            </div>
        <label>
          <span className="mb-2 block uppercase tracking-wide text-gray-700 text-xs">Valor</span>
          <input value={current.measure}
                 className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                 onChange={(event)=> {
                             if(!Number.isNaN(event.target.value) && event.target.value >= 0 ) {
                                 set({...value, [property]: {...current, measure: event.target.value}})
                         }}}
          />
        </label>
        <label>
          <span className="mb-2 block uppercase tracking-wide text-gray-700 text-xs">Unidad de medida</span>
                    <ReactSelector value={{value: current.unit, label: current.unit}}
                         options={structure[property].unit.map(element=>({value: element, label: element}))}
                         onChange={(event)=> set({...value, [property]: {...current, unit: event.value}  })} />
    </label>
</>)
}

const BaseDualMeasure = ({property, value, set, onClick}) => {
    const current = value[property] || {measure1: '', measure2: '', unit: ''}
    return (
        <>
            <div className="flex justify-between">
                <span className="mb-2 pt-2 block uppercase tracking-wide text-gray-700 text-xs font-bold">{structure[property].label}</span>
                <span className="mb-2 pt-2 block uppercase tracking-wide text-red-700 text-xs cursor-pointer font-bold"
                      onClick={onClick}
                >Borrar</span>
            </div>
        <label>
          <span className="mb-2 block uppercase tracking-wide text-gray-700 text-xs">Valor #1</span>
          <input value={current.measure1}
                 className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                 onChange={(event)=> {
                             if(!Number.isNaN(event.target.value) && event.target.value >= 0 ) {
                                 set({...value, [property]: {...current, measure1: event.target.value}})
                         }}}
          />
        </label>
        <label>
          <span className="mb-2 block uppercase tracking-wide text-gray-700 text-xs">Valor #2</span>
          <input value={current.measure2}
                 className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                 onChange={(event)=> {
                             if(!Number.isNaN(event.target.value) && event.target.value >= 0 ) {
                                 set({...value, [property]: {...current, measure2: event.target.value}})
                         }}}
          />
        </label>
        <label>
          <span className="mb-2 block uppercase tracking-wide text-gray-700 text-xs">Unidad de medida</span>
                    <ReactSelector value={{value: current.unit, label: current.unit}}
                         options={structure[property].unit.map(element=>({value: element, label: element}))}
                         onChange={(event)=> set({...value, [property]: {...current, unit: event.value}  })} />
    </label>
</>)
}



const OptionalParameters = ({...props }) => {

    const [selectedParameters, setSelectedParameters] = useState(initialSelectedParameters)
    const [additionalOptions, setAdditionalOptions] = useState(additionalOpt)

  return (
      <>
          <ReactSelector options={additionalOptions} noOptionsMessage={()=>"No se encontró"} className="mb-4" onChange={(value)=> addParameter(value, additionalOptions, setAdditionalOptions, selectedParameters, setSelectedParameters)} placeholder="Agregue parámetros" value='' />
          <input type="text" name="additionalParameters" value={JSON.stringify(selectedParameters)} readOnly hidden={true}/>
          {Object.keys(selectedParameters).map(property=>{
              switch (structure[property] && structure[property].type) {
                  case 'string': return (
                      <BaseString key={property} property={property} value={selectedParameters} set={setSelectedParameters} onClick={()=>removeParameter(property,additionalOptions, setAdditionalOptions, selectedParameters, setSelectedParameters)}/>
                  )
                  case 'listmulti': return (
                      <BaseListMulti key={property} property={property} value={selectedParameters} set={setSelectedParameters} onClick={()=>removeParameter(property,additionalOptions, setAdditionalOptions, selectedParameters, setSelectedParameters)}/>
                  )
                  case 'setlistmulti': return (
                      <BaseSetListMulti key={property} property={property} value={selectedParameters} set={setSelectedParameters} onClick={()=>removeParameter(property,additionalOptions, setAdditionalOptions, selectedParameters, setSelectedParameters)}/>
                  )
                  case 'measure': return(
                      <BaseMeasure key={property} property={property} value={selectedParameters} set={setSelectedParameters} onClick={()=>removeParameter(property,additionalOptions, setAdditionalOptions, selectedParameters, setSelectedParameters)}/>
                  )
                  case 'dualmeasure': return (
                      <BaseDualMeasure key={property} property={property} value={selectedParameters} set={setSelectedParameters} onClick={()=>removeParameter(property,additionalOptions, setAdditionalOptions, selectedParameters, setSelectedParameters)}/>
                  )
                  case 'warning': return (
                      <BaseString key={property} property={property} value={selectedParameters} set={setSelectedParameters} onClick={()=>removeParameter(property,additionalOptions, setAdditionalOptions, selectedParameters, setSelectedParameters)}/>
                  )
              }
          })}
      </>
  )
}

export default OptionalParameters
