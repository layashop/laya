import React, {useEffect, useRef, useState} from 'react'


const useModal = ({onOk , onCancel} = {}) => {
    const [show, setShow] = useState(false)
    const handleOk = () => {
        setShow(false) 
        if(onOk) onOk()
    }
    const handleCancel = () => {
        setShow(false)
        if(onCancel) onCancel()
    }
    const openModal = (e) => {
        e.preventDefault()
        setShow(true)
    }

    return [show, openModal, handleOk, handleCancel] 
}

const Modal = ({children, show , onOk, onCancel, root=true , title}) => {

    const [visibility, setVisibility ] = useState(show) 
    const ref = useRef()

    const handleOk = e => {
        setVisibility(false)
        if(onOk)onOk()
    }
    const handleCancel = (e) => {
        console.log('Cancel Event')
        setVisibility(false)
       if(onCancel) onCancel()
    }
  

    useEffect(()=> {
      if(show){
          setVisibility(show)
      }
    },[show])
    const stopBubbling = (e) => {
        e.stopPropagation(0)
    }
    return (<div ref={ref}
        style={{
            top: 0 ,
            left: 0
        }}
    className={`${! visibility ? 'hidden' : '' } ${root ? 'fixed' : 'relative'} w-full h-full bg-black bg-opacity-25 z-20`}
    onClick={handleCancel}
    >
       <div className={'bg-white divide-y w-full mx-auto my-auto'} onClick={stopBubbling}>
        <section className="p-2 px-4">
    <h1 className="font-lg">{title}</h1>
        </section>
        <section className="px-4 py-2">
             {children}
        </section>
        <section className='px-4 flex justify-space-around'>
            <button className="w-4/12 text-red-500 bg-white  hover:text-red-600 m-1 px-3 py-1 w-auto transistion-color duration-100 focus:outline-none" onClick={handleCancel}>Cancel</button>
            <button className='w-4/12 text-teal-600 bg-white  hover:text-teal-500 m-1 px-3 py-1 w-auto transistion-color duration-100 focus:outline-none' onClick={handleOk}>Ok</button>
        </section>
       </div>
    </div>)
}

export default Modal; 

export {
    Modal,
    useModal,
}