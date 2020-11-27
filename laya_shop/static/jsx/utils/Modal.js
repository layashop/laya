import React, {useEffect, useRef, useState} from 'react'
import {Box} from 'theme-ui'


const useModal = ({onOk, onCancel} = {}) => {
    const [show, setShow] = useState(false)
    const handleOk = () => {
        setShow(false)
        if (onOk) onOk()
    }
    const handleCancel = () => {
        setShow(false)
        if (onCancel) onCancel()
    }
    const openModal = (e) => {
        e.preventDefault()
        setShow(true)
    }

    return [show, openModal, handleOk, handleCancel]
}

const  Modal = ({children, show, onOk, onCancel, root = true, title, onOkButton, onCancelButton, printable, subtitle}) => {

    const [visibility, setVisibility] = useState(show)
    const ref = useRef()

    const handleOk = e => {
        setVisibility(false)
        if (onOk) onOk()
    }
    const handleCancel = (e) => {
        setVisibility(false)
        if (onCancel) onCancel()
    }


    useEffect(() => {
        if (show) {
            setVisibility(show)
        }
    }, [show])
    const stopBubbling = (e) => {
        e.stopPropagation(0)
    }

    return (
        <Box ref={ref}
             __css={{
                 top: 0,
                 left: 0,
                 display: !visibility ? 'none' : 'flex',
                 alignItems: 'center',
                 justifyContent: 'center'
             }}
             className={`${root ? 'fixed' : 'relative'}
    w-full h-full bg-black bg-opacity-50 z-20`}
             onClick={handleCancel}
        >
            <Box __css={{
                borderRadius: '10px',
                width: '70%',
                p: '15px',
                height: '80vh',
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column'
            }}
                 className={`${printable ? 'printable' : ''} bg-white divide-y`}
                 onClick={stopBubbling}>
                <Box as="section" __css={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', pb: '12px',
                    mt: '16px',
                    px: '30px',
                    fontSize: '30px',
                    borderBottom: '2px solid rgba(66, 153, 225, 0.5)'
                }}>
                    <Box as="h3" __css={{fontSize: '30px'}}>{title}</Box>
                    {subtitle && <Box as="h3" __css={{fontSize: '24px'}}>{subtitle}</Box>}
                </Box>
                <section className="px-4 py-2 flex-1">
                    {children}
                </section>
                <section className='px-4 flex justify-around'>
                    {onCancelButton ? onCancelButton
                        : <button
                            className="w-4/12 text-red-500 bg-white  hover:text-red-600 m-1 px-3 py-1 w-auto transistion-color duration-100 focus:outline-none"
                            onClick={handleCancel}>Cancelar</button>}
                    {onOkButton ? onOkButton
                        : <button
                            className='w-4/12 text-teal-600 bg-white  hover:text-teal-500 m-1 px-3 py-1 w-auto transistion-color duration-100 focus:outline-none'
                            onClick={handleOk}>Ok</button>}
                </section>
            </Box>
        </Box>)
}

export default Modal;

export {
    Modal,
    useModal,
}
