import { apiCall } from "../config/axios"

export interface LoginDto {
    email : string
    password : string
}

export interface MeResponseDto {
    id: string
    user_id: string
    name: string
    position: string
    department: string | null
    phone: string | null
    photo_url: string | null
    created_at: string
    updated_at: string
}


export async function authLogin(payload : LoginDto) {
    try {
        const response = await apiCall.post('/auth/login',{
            email : payload.email,
            password : payload.password
        })
        return response
    } catch (error) {
        throw error
    } 
}

export async function authMe() {
    try {
        const response = await apiCall.get<MeResponseDto>("/auth/me")
        return response
    } catch (error) {
        throw error
    }
}

export async function authUpdatePassword(userId: string, oldPassword: string, newPassword: string) {
    try {
        const response = await apiCall.put("/auth/update-password", { userId, oldPassword, newPassword })
        return response
    } catch (error) {
        throw error
    }
}

export function authLogout() {
    localStorage.removeItem("access-token")
    localStorage.removeItem("user_id")
    window.location.href = "/"
}
