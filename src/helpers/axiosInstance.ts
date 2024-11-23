import axios from 'axios'

const axiosInstance = axios.create({
    baseURL:
        process.env.NEXT_PUBLIC_STRAPI_BASE_URL || 'http://localhost:1337/api',
})

export default axiosInstance
