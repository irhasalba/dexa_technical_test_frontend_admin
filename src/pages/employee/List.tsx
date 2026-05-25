import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import DataTable from "../../components/data_table";
import Pagination from "../../components/pagination";
import ConfirmModal from "../../components/confirm_modal";
import Alert from "../../components/alert";
import { deleteEmployee, getEmployees, type EmployeeResponseDto, type PaginationMetaDto } from "../../service/employee";

const PAGE_SIZE = 10;

const columns = (
    onDeleteClick: (e: React.MouseEvent, row: EmployeeResponseDto) => void,
) => [
    {
        key: "photo_url" as keyof EmployeeResponseDto,
        header: "Foto",
        render: (value: EmployeeResponseDto[keyof EmployeeResponseDto], row: EmployeeResponseDto) => (
            <div className="avatar">
                <div className="w-10 rounded-full ring ring-base-300">
                    <img
                        src={value ? String(value) : `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(row.name)}`}
                        alt={row.name}
                    />
                </div>
            </div>
        ),
    },
    {
        key: "name" as keyof EmployeeResponseDto,
        header: "Nama",
        render: (value: EmployeeResponseDto[keyof EmployeeResponseDto], row: EmployeeResponseDto) => (
            <div>
                <p className="font-medium">{String(value)}</p>
                <p className="text-xs text-base-content/50">{row.position}</p>
            </div>
        ),
    },
    {
        key: "department" as keyof EmployeeResponseDto,
        header: "Departemen",
        render: (value: EmployeeResponseDto[keyof EmployeeResponseDto]) => (
            <span>{value ? String(value) : <span className="text-base-content/30">—</span>}</span>
        ),
    },
    {
        key: "phone" as keyof EmployeeResponseDto,
        header: "Telepon",
        render: (value: EmployeeResponseDto[keyof EmployeeResponseDto]) => (
            <span>{value ? String(value) : <span className="text-base-content/30">—</span>}</span>
        ),
    },
    {
        key: "id" as keyof EmployeeResponseDto,
        header: "",
        render: (_value: EmployeeResponseDto[keyof EmployeeResponseDto], row: EmployeeResponseDto) => (
            <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <Link
                    to={`/dashboard/employee/${row.id}/edit`}
                    onClick={(e) => e.stopPropagation()}
                    className="btn btn-ghost btn-xs"
                    aria-label={`Edit ${row.name}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                </Link>
                <button
                    className="btn btn-ghost btn-xs text-error"
                    onClick={(e) => onDeleteClick(e, row)}
                    aria-label={`Hapus ${row.name}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Hapus
                </button>
            </div>
        ),
    },
];

export default function EmployeeList() {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState<EmployeeResponseDto[]>([]);
    const [meta, setMeta] = useState<PaginationMetaDto>({ page: 1, limit: PAGE_SIZE, total: 0, totalPages: 0 });
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<EmployeeResponseDto | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [debouncedSearch, setDebouncedSearch] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setCurrentPage(1);
        }, 400);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        async function fetchEmployees() {
            setLoading(true);
            setError(null);
            try {
                const response = await getEmployees(currentPage, PAGE_SIZE, debouncedSearch || undefined);
                setEmployees(response.data.data);
                setMeta(response.data.meta);
            } catch {
                setError("Gagal memuat data karyawan. Silakan coba lagi.");
            } finally {
                setLoading(false);
            }
        }
        fetchEmployees();
    }, [currentPage, debouncedSearch]);

    function handleDeleteClick(e: React.MouseEvent, row: EmployeeResponseDto) {
        e.stopPropagation();
        setDeleteTarget(row);
    }

    async function confirmDelete() {
        if (!deleteTarget) return;
        setIsDeleting(true);
        try {
            await deleteEmployee(deleteTarget.id);
            setDeleteTarget(null);
            const response = await getEmployees(currentPage, PAGE_SIZE, debouncedSearch || undefined);
            setEmployees(response.data.data);
            setMeta(response.data.meta);
        } catch {
            setError("Gagal menghapus karyawan. Silakan coba lagi.");
            setDeleteTarget(null);
        } finally {
            setIsDeleting(false);
        }
    }

    function cancelDelete() {
        setDeleteTarget(null);
    }

    function handlePageChange(page: number) {
        setCurrentPage(page);
    }

    const startItem = meta.total === 0 ? 0 : (meta.page - 1) * meta.limit + 1;
    const endItem = Math.min(meta.page * meta.limit, meta.total);

    return (
        <section className="mx-auto w-full max-w-6xl px-2 py-3 md:px-6 md:py-6">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl font-semibold md:text-2xl">Data Karyawan</h1>
                    <p className="mt-1 text-sm text-base-content/50">
                        Total {meta.total} karyawan terdaftar
                    </p>
                </div>
                <label className="input input-bordered flex items-center gap-2 w-full sm:w-72">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Cari karyawan..."
                        className="grow"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </label>
                <Link className="btn btn-primary" to={"/dashboard/employee/create"}>Tambah Karyawan</Link>
            </div>

            {error && <Alert message={error} className="mb-4" />}

            {loading ? (
                <div className="flex justify-center py-16">
                    <span className="loading loading-spinner loading-lg" />
                </div>
            ) : (
                <DataTable<EmployeeResponseDto>
                    columns={columns(handleDeleteClick)}
                    data={employees}
                    keyField="id"
                    emptyMessage="Tidak ada karyawan yang ditemukan."
                    onRowClick={(row) => navigate(`/dashboard/employee/${row.id}/edit`)}
                />
            )}

            <ConfirmModal
                open={deleteTarget !== null}
                title="Hapus Karyawan"
                message={
                    <>
                        Yakin ingin menghapus{" "}
                        <span className="font-medium text-base-content">{deleteTarget?.name}</span>?
                        {" "}Tindakan ini tidak dapat dibatalkan.
                    </>
                }
                confirmLabel="Hapus"
                confirmVariant="btn-error"
                isLoading={isDeleting}
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />

            <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
                <p className="text-sm text-base-content/50">
                    Menampilkan {startItem}–{endItem} dari {meta.total} karyawan
                </p>
                <Pagination
                    currentPage={currentPage}
                    totalPages={meta.totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
        </section>
    );
}