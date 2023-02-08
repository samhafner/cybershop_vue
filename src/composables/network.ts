import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'

async function useNetworkRequest(options: AxiosRequestConfig) {

    try {
        const response: AxiosResponse = await axios({
            ...options
        })

        if (response) {
            return response
        }

        return null

    } catch (error: any) {
        if (error.response) {
            console.log('Error response', { data: error.response.data, status: error.response.status, headers: error.response.headers });
            return error.response
        } else {
            console.log('Error', error);
            return null
        }
    }

    
}

export { useNetworkRequest }