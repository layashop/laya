import React, {useState} from "react"
import ReactSelector from "react-select"
import CreatableSelect from "react-select/creatable"
import structure from './structure'
import {Box} from "theme-ui";

const additionalOpt = []

for( const type in structure ) {
    additionalOpt.push({value: type, ...structure[type]})
}


const BaseString = ({property, value, set}) => {
    return (
        <label>
          <span className="mb-2 pt-2 block uppercase tracking-wide text-gray-700 text-xs font-bold">{structure[property].label}</span>
          <input value={value[property]}
                 className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                 onChange={(e)=> set({...value, [property]: e.target.value})} />
        </label>
    )
}

const BaseSetListMulti = ({property, value, set}) => {
    return (
        <label>
          <span className="mb-2 pt-2 block uppercase tracking-wide text-gray-700 text-xs font-bold">{structure[property].label}</span>
          <ReactSelector value={value[property] && value[property].map(el=>({value: el, label: el}))||''} isMulti
                         options={structure[property].option.map(element=>({value: element, label: element}))}
                         onChange={(event)=> set({...value, [property]: event ? event.map(el => el.value) : [] })} />
    </label>)
}

const BaseListMulti = ({property, value, set}) => {
    return (
        <label>
          <span className="mb-2 pt-2 block uppercase tracking-wide text-gray-700 text-xs font-bold">{structure[property].label}</span>
          <CreatableSelect value={value[property] && value[property].map(el=>({value: el, label: el}))||''} isMulti
                           onChange={(event)=> set({...value, [property]: event ? event.map(el => el.value) : [] })}
                           noOptionsMessage={() => 'Agregar valores'}
                           formatCreateLabel={(value) => `Agregar "${value}"`}
                           placeholder="Agregue valores"/>
    </label>)
}

const BaseMeasure = ({property, value, set}) => {
    const current = value[property] || {measure: '', unit: ''}
    return (
        <>
            <span className="mb-2 pt-2 block uppercase tracking-wide text-gray-700 text-xs font-bold">{structure[property].label}</span>
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

const BaseDualMeasure = ({property, value, set}) => {
    const current = value[property] || {measure1: '', measure2: '', unit: ''}
    return (
        <>
            <span className="mb-2 pt-2 block uppercase tracking-wide text-gray-700 text-xs font-bold">{structure[property].label}</span>
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

    const [additionalOptions, setAdditionalOptions] = useState(additionalOpt)
    const [selectedParameters, setSelectedParameters] = useState([{key: 'brand', value: 'Samsung'}])

    console.log(selectedParameters)

  return (
      <>
          <ReactSelector options={additionalOptions} placeholder="Agregue parámetros" value='' />
          <BaseString property="brand" value={selectedParameters} set={setSelectedParameters}/>
          <BaseSetListMulti property="recipient" value={selectedParameters} set={setSelectedParameters}/>
          <BaseListMulti property="flavor" value={selectedParameters} set={setSelectedParameters}/>
          <BaseMeasure property="weight" value={selectedParameters} set={setSelectedParameters}/>
          <BaseDualMeasure property="screen_size" value={selectedParameters} set={setSelectedParameters}/>
      </>
  )
}

export default OptionalParameters
