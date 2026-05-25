import {apiCall} from "../config/axios";

export interface AttendanceEmployeeDto {
    id: string;
    name: string;
    department: string | null;
    position: string;
}

export interface AttendanceItemDto {
    id: string;
    employee_id: string;
    attendance_date: string;
    check_in_time: string | null;
    check_out_time: string | null;
    status: "check_in" | "check_out";
    created_at: string;
    updated_at: string;
    employees: AttendanceEmployeeDto;
}

export interface AttendanceListMetaDto {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface PaginatedAttendanceResponseDto {
    data: AttendanceItemDto[];
    meta: AttendanceListMetaDto;
}

export interface GetAttendancesParams {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
    employeeName?: string;
}

export function getAttendances(params: GetAttendancesParams = {}) {
    return apiCall.get<PaginatedAttendanceResponseDto>("/attendances", { params });
}
