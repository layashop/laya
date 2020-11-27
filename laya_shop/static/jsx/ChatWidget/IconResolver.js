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
        <svg xmlns="http://www.w3.org/2000/svg" className="inline-block ml-1 icon-tabler icon-tabler-plus" width="20"
             height="20"
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
    search: (
        <svg xmlns="http://www.w3.org/2000/svg" className="inline-block p-1 mr-1 icon-tabler icon-tabler-search"
             width="40" height="40"
             viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2c3e50" fill="none" strokeLinecap="round"
             strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <circle cx="10" cy="10" r="7"/>
            <line x1="21" y1="21" x2="15" y2="15"/>
        </svg>
    ),
    deal: (
        <svg xmlns="http://www.w3.org/2000/svg" className="inline-block p-1 mr-1 icon-tabler icon-tabler-license"
             width="40" height="40"
             viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2c3e50" fill="none" strokeLinecap="round"
             strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M15 21h-9a3 3 0 0 1 -3 -3v-1h10v2a2 2 0 0 0 4 0v-14a2 2 0 1 1 2 2h-2m2 -4h-11a3 3 0 0 0 -3 3v11"/>
            <line x1="9" y1="7" x2="13" y2="7"/>
            <line x1="9" y1="11" x2="13" y2="11"/>
        </svg>
    ),
    star: (<svg xmlns="http://www.w3.org/2000/svg" height="35" viewBox="0 -10 511.98685 511" width="35">
        <path
            d="m510.652344 185.902344c-3.351563-10.367188-12.546875-17.730469-23.425782-18.710938l-147.773437-13.417968-58.433594-136.769532c-4.308593-10.023437-14.121093-16.511718-25.023437-16.511718s-20.714844 6.488281-25.023438 16.535156l-58.433594 136.746094-147.796874 13.417968c-10.859376 1.003906-20.03125 8.34375-23.402344 18.710938-3.371094 10.367187-.257813 21.738281 7.957031 28.90625l111.699219 97.960937-32.9375 145.089844c-2.410156 10.667969 1.730468 21.695313 10.582031 28.09375 4.757813 3.4375 10.324219 5.1875 15.9375 5.1875 4.839844 0 9.640625-1.304687 13.949219-3.882813l127.46875-76.183593 127.421875 76.183593c9.324219 5.609376 21.078125 5.097657 29.910156-1.304687 8.855469-6.417969 12.992187-17.449219 10.582031-28.09375l-32.9375-145.089844 111.699219-97.941406c8.214844-7.1875 11.351563-18.539063 7.980469-28.925781zm0 0"
            fill="currentColor"/>
    </svg>),
    circle: (
        <svg xmlns="http://www.w3.org/2000/svg" className="inline-block p-1 mr-1 icon-tabler icon-tabler-circle-x"
             width="24" height="24"
             viewBox="0 0 24 24" strokeWidth="1.5" stroke="#ffffff" fill="none" strokeLinecap="round"
             strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <circle cx="12" cy="12" r="9"/>
            <path d="M10 10l4 4m0 -4l-4 4"/>
        </svg>
    ),
    dealSent: (
        <svg xmlns="http://www.w3.org/2000/svg" className="inline-block icon-tabler icon-tabler-cash" width="48"
             height="48"
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
