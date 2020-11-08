import React from 'react'

const icons = {
    clock: (
        <svg xmlns="http://www.w3.org/2000/svg" className="inline-block icon-tabler icon-tabler-clock" width="24"
             height="24"
             viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2c3e50" fill="none" strokeLinecap="round"
             strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <circle cx="12" cy="12" r="9"/>
            <polyline points="12 7 12 12 15 15"/>
        </svg>),
    check: (
        <svg xmlns="http://www.w3.org/2000/svg" className="inline-block pb-1 icon-tabler icon-tabler-check" width="24"
             height="24"
             viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2c3e50" fill="none" strokeLinecap="round"
             strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M5 12l5 5l10 -10"/>
        </svg>),
    doubleCheck: (
        <svg xmlns="http://www.w3.org/2000/svg" className="inline-block pb-1 icon-tabler icon-tabler-checks" width="24"
             height="24"
             viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2c3e50" fill="none" strokeLinecap="round"
             strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M7 12l5 5l10 -10"/>
            <path d="M2 12l5 5m5 -5l5 -5"/>
        </svg>
    ),
    send: (<svg xmlns="http://www.w3.org/2000/svg" className="inline-block ml-1 icon-tabler icon-tabler-send" width="16"
                height="16"
                viewBox="0 0 24 24" strokeWidth="1.5" stroke="#38b2ac" fill="none" strokeLinecap="round"
                strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <line x1="10" y1="14" x2="21" y2="3"/>
        <path d="M21 3l-6.5 18a0.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a0.55 .55 0 0 1 0 -1l18 -6.5"/>
    </svg>),
    deal: (
        <svg xmlns="http://www.w3.org/2000/svg" className="inline-block ml-1 icon-tabler icon-tabler-coin" width="20"
             height="20"
             viewBox="0 0 24 24" strokeWidth="1.5" stroke="#38b2ac" fill="none" strokeLinecap="round"
             strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <circle cx="12" cy="12" r="9"/>
            <path d="M14.8 9a2 2 0 0 0 -1.8 -1h-2a2 2 0 0 0 0 4h2a2 2 0 0 1 0 4h-2a2 2 0 0 1 -1.8 -1"/>
            <path d="M12 6v2m0 8v2"/>
        </svg>
    ),
    back: (
        <svg xmlns="http://www.w3.org/2000/svg" className="inline-block ml-1 pb-1 icon-tabler icon-tabler-chevrons-left" width="40"
             height="40" viewBox="0 0 24 24" strokeWidth="0.8" stroke="#3182CE" fill="none" strokeLinecap="round"
             strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <polyline points="11 7 6 12 11 17"/>
            <polyline points="17 7 12 12 17 17"/>
        </svg>
    )

}

const IconResolver = ({
                          icon
                      }) => {
    return icons[icon]
}


export default IconResolver
