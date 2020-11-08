import React from 'react'

const icons = {
    clock : (
        <svg xmlns="http://www.w3.org/2000/svg" className="inline-block icon-tabler icon-tabler-clock" width="24" height="24"
             viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2c3e50" fill="none" strokeLinecap="round"
             strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <circle cx="12" cy="12" r="9"/>
            <polyline points="12 7 12 12 15 15"/>
        </svg>),
    check: (
        <svg xmlns="http://www.w3.org/2000/svg" className="inline-block pb-1 icon-tabler icon-tabler-check" width="24" height="24"
             viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2c3e50" fill="none" strokeLinecap="round"
             strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M5 12l5 5l10 -10"/>
        </svg>),
    doubleCheck: (
        <svg xmlns="http://www.w3.org/2000/svg" className="inline-block pb-1 icon-tabler icon-tabler-checks" width="24" height="24"
             viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2c3e50" fill="none" strokeLinecap="round"
             strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M7 12l5 5l10 -10"/>
            <path d="M2 12l5 5m5 -5l5 -5"/>
        </svg>
    )
}

const IconResolver = ({
    icon
}) => {
    return icons[icon]
}


export default IconResolver
