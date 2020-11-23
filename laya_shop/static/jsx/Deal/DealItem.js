import React from 'react'
import Modal, { useModal } from '../utils/Modal'


const printDeal = () => {
    window.print()
}
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

const DealItem =({deal}) => {

    const [show, openModal, handleOk, handleCancel] = useModal()
    
 
    // Id del Acuerdo , Mostrar el Usuario o el Business, Estado
    return (<>
    <div id={`deal-${deal.id}`} onClick={openModal}>
       <span>{`#${deal.id}`}</span>
    <span>{IS_USER ?  (deal.business.name): (deal.user.name || deal.user.username) }</span> 
    <span>{choices[deal.status]}</span>

    </div>
    <Modal
        printable
        show={show}
        onOk={handleOk}
        onCancel={handleCancel}
        title='Deal'
        onOkButton={
            <button className='w-4/12 text-teal-600 bg-white  hover:text-teal-500 m-1 px-3 py-1 w-auto transistion-color duration-100 focus:outline-none' onClick={printDeal}>Imprimir</button>
        }
    >
        <div>
            Carlos Aqui mete tus detalles o lo ahces un custom component idk
        </div>
    </Modal>
    </>)
}

 export default DealItem