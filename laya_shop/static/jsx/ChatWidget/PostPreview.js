import React from 'react'
import {Box} from 'theme-ui'


const PostPreview = ({data, ownMessage}) => {
    return <>{data.map((item) => {
        return (<a href={`/${item.business.slug}/posts/${item.id}`} target="_blank" className="w-full flex items-center mb-1 rounded-md hover:bg-gray-200 transition duration-100" key={item.id}>
            <Box as="img" sx={{width: 80, height: 80, mr: '4px'}} src={`${item.images[0].sizes["200x200"]}`}/>
            <div className="flex-1">
                <Box as="p" sx={{display: '-webkit-box',
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden', fontWeight: 'bold'}}>{item.title}</Box>
                <Box as="p" sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                }}>{item.description}</Box>
            </div>
        </a>)
    })}</>
}


export default PostPreview
