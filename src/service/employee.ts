import { apiCall } from "../config/axios"

export interface EmployeeResponseDto {
    id: string
    user_id: string
    name: string
    department: string | null
    phone: string | null
    photo_url: string | null
    position: string
    created_at: string
    updated_at: string
}

export interface PaginationMetaDto {
    page: number
    limit: number
    total: number
    totalPages: number
}

export interface PaginatedEmployeeResponseDto {
    data: EmployeeResponseDto[]
    meta: PaginationMetaDto
}

export async function getEmployees(page = 1, limit = 10, name?: string) {
    const response = await apiCall.get<PaginatedEmployeeResponseDto>("/employee", {
        params: { page, limit, ...(name ? { name } : {}) },
    })
    return response
}

export interface CreateEmployeeRequest {
    email: string
    password: string
    name: string
    phone: string
    position: string
    departement: string
    role: "employee" | "admin"
    photoUrl?: string
}

export interface UpdateEmployeeDto {
    email?: string
    name?: string
    phone?: string
    position?: string
    departement?: string
    photoUrl?: string
    role?: "employee" | "admin"
}

export async function getEmployee(id: string) {
    const response = await apiCall.get<EmployeeResponseDto>(`/employee/${id}`)
    return response
}

export async function updateEmployee(id: string, payload: UpdateEmployeeDto) {
    const response = await apiCall.put<EmployeeResponseDto>(`/employee/${id}`, payload)
    return response
}

export async function createEmployee(payload: CreateEmployeeRequest) {
    const response = await apiCall.post("/employee", payload)
    return response
}

export async function uploadEmployeePhoto(id: string, file: File) {
    const formData = new FormData()
    formData.append("file", file)
    const response = await apiCall.post(`/employee/upload/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    })
    return response
}

export async function deleteEmployee(id: string) {
    const response = await apiCall.delete<EmployeeResponseDto>(`/employee/${id}`)
    return response
}
