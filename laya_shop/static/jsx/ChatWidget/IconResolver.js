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
    more: (
        <svg xmlns="http://www.w3.org/2000/svg" className="inline-block ml-1 icon-tabler icon-tabler-plus" width="20" height="20"
             viewBox="0 0 24 24" strokeWidth="1.5" stroke="#38b2ac" fill="none" strokeLinecap="round"
             strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
    ),
    back: (
        <svg xmlns="http://www.w3.org/2000/svg" className="inline-block ml-1 pb-1 icon-tabler icon-tabler-chevrons-left"
             width="40"
             height="40" viewBox="0 0 24 24" strokeWidth="0.8" stroke="#3182CE" fill="none" strokeLinecap="round"
             strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <polyline points="11 7 6 12 11 17"/>
            <polyline points="17 7 12 12 17 17"/>
        </svg>
    ),
    upright: (
        <svg xmlns="http://www.w3.org/2000/svg"
             className="inline-block icon-tabler icon-tabler-arrow-up-right" width="40"
             height="40" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2c3e50" fill="none" strokeLinecap="round"
             strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <line x1="17" y1="7" x2="7" y2="17"/>
            <polyline points="8 7 17 7 17 16"/>
        </svg>
    ),
    search : (
        <svg xmlns="http://www.w3.org/2000/svg" className="inline-block p-1 mr-1 icon-tabler icon-tabler-search" width="40" height="40"
             viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2c3e50" fill="none" strokeLinecap="round"
             strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <circle cx="10" cy="10" r="7"/>
            <line x1="21" y1="21" x2="15" y2="15"/>
        </svg>
    ),
    deal: (
        <svg xmlns="http://www.w3.org/2000/svg" className="inline-block p-1 mr-1 icon-tabler icon-tabler-license" width="40" height="40"
             viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2c3e50" fill="none" strokeLinecap="round"
             strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M15 21h-9a3 3 0 0 1 -3 -3v-1h10v2a2 2 0 0 0 4 0v-14a2 2 0 1 1 2 2h-2m2 -4h-11a3 3 0 0 0 -3 3v11"/>
            <line x1="9" y1="7" x2="13" y2="7"/>
            <line x1="9" y1="11" x2="13" y2="11"/>
        </svg>
    ),
    circle: (
        <svg xmlns="http://www.w3.org/2000/svg" className="inline-block p-1 mr-1 icon-tabler icon-tabler-circle-x" width="24" height="24"
             viewBox="0 0 24 24" strokeWidth="1.5" stroke="#ffffff" fill="none" strokeLinecap="round"
             strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <circle cx="12" cy="12" r="9"/>
            <path d="M10 10l4 4m0 -4l-4 4"/>
        </svg>
    ),
    dealSent: (
        <svg xmlns="http://www.w3.org/2000/svg" className="inline-block icon-tabler icon-tabler-cash" width="48" height="48"
             viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round"
             strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <rect x="7" y="9" width="14" height="10" rx="2"/>
            <circle cx="14" cy="14" r="2"/>
            <path d="M17 9v-2a2 2 0 0 0 -2 -2h-10a2 2 0 0 0 -2 2v6a2 2 0 0 0 2 2h2"/>
        </svg>
    )

}

const IconResolver = ({
                          icon
                      }) => {
    return icons[icon]
}


export default IconResolver
