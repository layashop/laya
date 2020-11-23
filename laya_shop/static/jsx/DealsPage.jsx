import React, {useState, useEffect} from 'react'
import  {render} from 'react-dom'
import DealCategory from './Deal/DealCategory'
import {useFetch, LOADING, FINISHED} from './utils/useFetch'
const API = 'http://localhost:8000/api/deals'
// Status, Sent by, User
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
const DealPage = () => {
    const [loading, error ,sendRequest] = useFetch()
    const [deals, setDeals] = useState([])
    const [groupData, setGroupedData] = useState({})
    const isUser = IS_USER
    const loadDeals = async () => {
        const query = isUser ? `user&user=${USER.id}` : `business&business=${BUSINESS.id}`

       try{
            const result = await sendRequest(`${API}/?type=${query}`)
            if(!result.error){
                setDeals(result)
            }
       }catch(e){
           console.log('There was an Error')
       }
    }
    useEffect(()=>{
        loadDeals()
    },[])
    useEffect(()=>{
        if(deals.length > 0){
            const newGroupedData =  Object.entries(choices).reduce((groupedData, [key, value] ) => {
                console.log('Grouping by',key )
                const fixedKey = parseInt(key)
                groupedData[value] = deals.filter( deal => {
                    console.log('Deal Id', deal.status)
                    console.log(`Is Equal ${deal.status} == ${key}`,deal.status === fixedKey)
                    return deal.status === fixedKey
                })
                return groupedData
            },{})
            setGroupedData(newGroupedData)
        }
    },[deals])


    let component
    if(loading === LOADING){
        component = '...Loading'
    }

    if(loading === FINISHED){
        if(deals.length > 0){
            component = Object.entries(groupData).map(([category, data]) => <DealCategory category={category} data={data}/>)
        }else{
            component = 'No Data Found'
        }

    }

    return (<div className="md:pt-20 lg:mx h-screen divide-y"
>
    <div>
        Deals
    </div>
        {component}
    </div>)

}

// Id del Acuerdo , Mostrar el Usuario o el Business, Estado



console.log('Deals Page')
const page = document.getElementById('deals')
render(<DealPage/>, page)