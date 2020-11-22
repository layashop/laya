import React, {useState} from 'react'
import {Box} from 'theme-ui'
import ReactSelect from 'react-select'
import _ from 'lodash'
import PostSelector from "../PostSelector/PostSelector";

const DealMaker = ({activeDeal, isNew, setActiveDeal, isLoadedPost, postData, selectedPost, setSelectedPost, onSubmit, isBusiness}) => {

    const [postInfo, setPostInfo] = useState({})

    return (
        <Box>
            <Box
                as="h3">{isNew ? 'Crear un nuevo acuerdo' : `Modificar acuerdo #${_.padStart(dealdata.id, 7, '0')}`}</Box>
            <Box as="label">
                Seleccione el estado
                <ReactSelect/>
            </Box>
            <Box as="h3">Seleccione los productos</Box>

            <PostSelector data={postData} isLoaded={isLoadedPost} selected={selectedPost} setSelected={setSelectedPost}
                          isEmbedded={false}/>

            <Box as="label">
                Moneda
                <ReactSelect/>
            </Box>
            {selectedPost > 0 ? selectedPost.map((post => {
                return (
                    <Box __css={{display: 'flex'}} key={post.id}>
                        <Box>{post.title}</Box>
                        <ReactSelect/>
                        <Box as="label">
                            {postInfo[item.id].isUnitPrice ? 'Precio Unitario' : 'Precio Total'}
                            <Box as="input"/>
                        </Box>
                        <Box as="label">
                            Cantidad
                            <Box as="input"/>
                        </Box>
                        {postInfo[item.id].isUnitPrice &&
                        (<Box as="label">
                            Precio Total
                            <Box as="input" readOnly/>
                        </Box>)}
                        <Box as="label">
                            <Box as="textarea"/>
                        </Box>
                    </Box>)
            })) : <Box>Seleccione un producto de la lista de arriba</Box>}
            <Box as="label">
                {&& 'Fecha máxima de reserva'}
                {&& 'Fecha máxima de entrega'}

            </Box>
            <Box as="label">
                Promoción
                <Box as="textarea"/>
            </Box>
            <Box as="label">
                Método de entrega
                <ReactSelect/>
            </Box>
            <Box as="label">
                Instrucciones de entrega
                <Box as="textarea"/>
            </Box>
            <Box as="label">
                Política de reembolso
                <Box as="textarea"/>
            </Box>
        </Box>
    )

}

export default DealMaker
