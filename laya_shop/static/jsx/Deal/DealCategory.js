import React, {useState} from 'react'
import DealItem from './DealItem'


const DealCategory = ({category, data=[]}) => {
    const [show, setShow] = useState(false)
    const toggleShow = () => setShow((prevState) => !prevState)
    console.log(category)
    return <div id={`category-${category}`}>
        <div>
            {category}
            <span onClick={toggleShow}> EXPAND</span>
        </div>
       {show &&  <div>
            {data.map( deal => <DealItem deal={deal}/>)}
        </div>}

    </div>
}

export default DealCategory