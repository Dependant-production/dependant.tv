import axios from 'axios'

const axiosInstance = axios.create({
    baseURL:
        process.env.NEXT_PUBLIC_STRAPI_BASE_URL || 'https://cms.dependant.tv',
})

export default axiosInstance
