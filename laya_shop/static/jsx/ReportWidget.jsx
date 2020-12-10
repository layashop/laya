import React, {useState, useRef} from 'react'
import {Box} from "theme-ui";
import ReactDOM from 'react-dom'
import  getCookie from './utils/getCookies'


const PRODUCT_INFO = document.getElementById('post_info')

const domain = 'localhost'
const ReportWidget = () => {
    const overlayRef = useRef()
    const formRef = useRef()
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [showError, setShowError] = useState(false)
    const user = useState(USER)

    const hideError = () => setShowError(false)
    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log(USER)
        const formData = new FormData(formRef.current)

        const requestBody = {
            user : USER.pk,
            post : parseInt(PRODUCT_INFO.dataset.postId),
            categorias: parseInt(formData.get('categorias')),
            descripcion: formData.get('descripcion')
        }

        if(requestBody.user && requestBody.post){
           try{
                await fetch(`http://${domain}:8000/api/posts/reports/`,{
                headers:{
                    'Content-Type' : 'application/json',
                    "X-CSRFToken": getCookie('csrftoken')

                },
                method:'POST',
                body:JSON.stringify(requestBody)
            })

            setIsOpenModal(false)
           }catch(e){
               console.log(e)
           }
        }else{
            setShowError(true)
        }

    }

    const openModal = () => setIsOpenModal(true)


    return   <>
      <button id="trigger-reports" className="px-8 py-2 max-w-md mx-2 my-1 flex-1 bg-red-600 text-white text-sm font-medium rounded transition duration-300 hover:bg-red-500
                                    focus:outline-none focus:bg-indigo-500"
        onClick={openModal}>Reportar
          </button>
    {isOpenModal && (<Box
                __css={{
                    display: 'flex',
                    position: 'fixed',
                    zIndex: 100,
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100vh',
                    bg: 'rgba(0,0,0,0.5)',
                    alignItems: "center",
                    justifyContent: 'center'
                }}
                ref={overlayRef}
                onClick={e => {
                    e.preventDefault()
                    if (e.target === overlayRef.current) {
                        setIsOpenModal(false)
                    }
                }}>
                <Box __css={{width: ["100%", '80%'], bg: 'white', borderRadius: '10px'}}>
                    <form ref={formRef} onSubmit={handleSubmit}>
                        <select name="categorias" id="">
                            <option value="1">Productos Ilegales</option>
                            <option value="2">Estafa</option>
                            <option value="3">Publicidad Enganosa</option>
                            <option value="4">Roba mi propiedad Intelectual</option>
                            <option value="5">Esta en contra de los TOS</option>
                        </select>
                        <textarea name="descripcion" id="descripcion" cols="30" rows="10"></textarea>
                        {
                            showError && (
                                <div>
                                    Necesitas iniciar sesion para reportar este post

                                    <span onClick={hideError}>Close</span>
                                </div>
                            )
                        }
                        <button onClick={handleSubmit} type="submit">Enviar</button>
                    </form>
                </Box>
            </Box>)}
    </>


}

const button = document.getElementById('trigger-reports')
console.log('Is being called');
ReactDOM.render( <ReportWidget/>,button)
