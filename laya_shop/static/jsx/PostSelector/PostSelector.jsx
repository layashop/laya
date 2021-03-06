import React, {useEffect, useState} from 'react'
import {Box} from 'theme-ui'
import _ from 'lodash'
import IconResolver from "../ChatWidget/IconResolver";

const PostSelector = ({isLoaded, data, selected, setSelected, onSubmit, isEmbedded = false}) => {

    const [searchText, setSearchText] = useState('')
    const [searchQuery, setSearchQuery] = useState('')

    const enableSubmit = selected.length > 0

    return (<>
        {!isEmbedded && <Box as="h3" __css={{
            pb: '12px',
            mt: '16px',
            px: '30px',
            fontSize: ['24px', null, '30px'],
            borderBottom: '2px solid rgba(66, 153, 225, 0.5)'
        }}>Seleccione productos</Box>}
        <Box className="bg-gray-100" __css={{
            button: {
                cursor: 'pointer',
                color: 'rgb(49, 151, 149)',
                flex: 1,
                px: '5px',
                py: '4px',
                bg: 'white',
                transition: '100ms',
                ':hover': {
                    bg: 'rgb(226, 232, 240)',
                }
            },
            display: 'flex',
            alignItems: 'stretch'
        }}>
            <Box as="input" __css={{bg: 'white', width: [ '40%', null, '60%'], px: ['10px', null, '30px']}} placeholder="Buscar producto"
                 onChange={e => setSearchText(e.target.value)}
                 onKeyUp={e => e.key === "Enter" ? setSearchQuery(searchText) : null}
                 value={searchText}
            />
            <Box as="button" onClick={e => {
                e.preventDefault()
                setSearchQuery(searchText)
            }}>Buscar</Box>
            <Box as="button" onClick={e => {
                e.preventDefault()
                setSearchQuery('')
                setSearchText('')
            }}>Limpiar Búsqueda</Box>
            <Box as="button" onClick={e => {
                e.preventDefault()
                setSelected([])
            }}>Limpiar Selección</Box>
        </Box>
        <Box className="bg-gray-100"
             __css={{
                 height: '400px',
                 display: 'flex',
                 flexWrap: 'wrap',
                 justifyContent: 'flex-start',
                 p: '20px',
                 overflowY: 'auto',
                 borderBottomLeftRadius: !isEmbedded ? '10px' : '',
                 borderBottomRightRadius: !isEmbedded ? '10px' : '',
             }}>
            {isLoaded ? (<>{data.length > 0 ? data.map((item, index) => {

                    const selectedIndex = _.findIndex(selected, {id: item.id})
                    console.log(item)
                    return (
                        <React.Fragment
                            key={item.id}>{searchQuery === '' || item.title.toLowerCase().includes(searchQuery.toLowerCase()) ?
                            <Box __css={{width: ['100%', null, '50%',  null, '25%'], p: '10px', }}>
                                <Box __css={{
                                    border: '2px solid',
                                    borderColor: selectedIndex !== -1 ? '#348ceb' : 'transparent',
                                    borderRadius: '5px',
                                    bg: 'white',
                                    boxShadow: '0 0 2rem 0 rgba(136, 152, 170, 0.15)',
                                    transform: 'scale(1)',
                                    p: '10px',
                                    display: 'flex'
                                }}
                                     onClick={() => {
                                         if (selectedIndex === -1) {
                                             setSelected([...selected, data[index]])
                                         } else {
                                             const newSelected = [...selected]
                                             newSelected.splice(selectedIndex, 1)
                                             setSelected(newSelected)
                                         }
                                     }}
                                     key={item.id}
                                >
                                    <Box as="img" src={item.images[0].sizes['200x200']} __css={{maxWidth: '120px', minWidth: '120px', height: 'auto', borderRadius: '5px', mr: '10px' }}/>
                                    <Box>
                                        <Box as="h4" __css={{fontSize: '20px', lineHeight: 1.1, display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden'}} >{item.title}</Box>
                                        <Box __css={{display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden'}}>{item.description}</Box>
                                        <Box>{item.currency.symbol}{item.final_price}</Box>
                                    </Box>
                                </Box>
                            </Box> : <></>
                        } </React.Fragment>
                    )
                }) :
                <Box>
                    NO SE ENCONTRO NADA
                </Box>}</>) : <div className="loader-dark mt-4">Cargando...</div>}
        </Box>

        {!isEmbedded && (<Box className="bg-gray-100" __css={{
            display: 'flex',
            justifyContent: 'flex-end',
            borderBottomLeftRadius: '10px',
            borderBottomRightRadius: '10px',
        }}>
            <Box as="button"
                 onClick={(e) => {
                     if (enableSubmit) {
                         onSubmit(e)
                     }
                 }}
                 __css={{
                     bg: enableSubmit ? '#3473d9' : '#d9d9d9',
                     color: enableSubmit ? 'white' : 'black',
                     transition: '0.5s',
                     px: '20px',
                     py: '5px',
                     mb: '15px',
                     mr: '30px',
                     borderRadius: '5px'
                 }}>
                {selected.length} seleccionado(s)
            </Box>
        </Box>)}


    </>)
}

export default PostSelector
