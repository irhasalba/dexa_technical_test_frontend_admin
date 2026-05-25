import axios from "axios"

const baseUrl = axios.create({
    baseURL : "http://localhost:3000/api/v1/"
})

baseUrl.interceptors.request.use((config) => {
    const token = localStorage.getItem("access-token")
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

baseUrl.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("access-token")
            localStorage.removeItem("user_id")
            window.location.href = "/"
        }
        return Promise.reject(error)
    }
)

export const apiCall = baseUrl