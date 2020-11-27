import {useState} from 'react'

const CALL_PENDING = 'CALL_PENDING'
const LOADING = 'LOADING'
const FINISHED = 'FINISHED'
const useFetch = () => {
    const [loading, setLoading] = useState(CALL_PENDING)
    const [error, setError] = useState()

    const sendRequest = async (url, options = {}, showLoading = true) => {
        if (showLoading) {
            setLoading(LOADING)
        }
        try {
            const request = await fetch(url, options)
            const json = await request.json()
            if (showLoading) {
                setLoading(FINISHED)
            }

            return json
        } catch (e) {
            if (showLoading) {
                setLoading(FINISHED)
            }
            setError(e)
            return {
                error: true,
                error_message: e
            }
        }

    }

    return [loading, error, sendRequest]

}

export default {
    useFetch,
    LOADING,
    CALL_PENDING,
    FINISHED
}

export {
    useFetch,
    LOADING,
    CALL_PENDING,
    FINISHED
}
