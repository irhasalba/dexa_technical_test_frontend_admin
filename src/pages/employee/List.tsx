import { useState } from "react";
import { Link, useNavigate } from "react-router";
import DataTable from "../../components/data_table";
import Pagination from "../../components/pagination";
import ConfirmModal from "../../components/confirm_modal";

type Employee = {
    id: number;
    nama: string;
    email: string;
    foto: string;
    departemen: string;
    posisi: string;
    aktif: boolean;
};

const mockEmployees: Employee[] = [
    {
        id: 1,
        nama: "Andi Pratama",
        email: "andi.pratama@example.com",
        foto: "https://api.dicebear.com/9.x/initials/svg?seed=Andi+Pratama",
        departemen: "Teknologi Informasi",
        posisi: "Frontend Developer",
        aktif: true,
    },
    {
        id: 2,
        nama: "Budi Santoso",
        email: "budi.santoso@example.com",
        foto: "https://api.dicebear.com/9.x/initials/svg?seed=Budi+Santoso",
        departemen: "Keuangan",
        posisi: "Akuntan",
        aktif: true,
    },
    {
        id: 3,
        nama: "Citra Dewi",
        email: "citra.dewi@example.com",
        foto: "https://api.dicebear.com/9.x/initials/svg?seed=Citra+Dewi",
        departemen: "Sumber Daya Manusia",
        posisi: "HR Manager",
        aktif: false,
    },
    {
        id: 4,
        nama: "Deni Kurniawan",
        email: "deni.kurniawan@example.com",
        foto: "https://api.dicebear.com/9.x/initials/svg?seed=Deni+Kurniawan",
        departemen: "Teknologi Informasi",
        posisi: "Backend Developer",
        aktif: true,
    },
    {
        id: 5,
        nama: "Eka Rahayu",
        email: "eka.rahayu@example.com",
        foto: "https://api.dicebear.com/9.x/initials/svg?seed=Eka+Rahayu",
        departemen: "Pemasaran",
        posisi: "Marketing Specialist",
        aktif: false,
    },
    {
        id: 6,
        nama: "Fajar Hidayat",
        email: "fajar.hidayat@example.com",
        foto: "https://api.dicebear.com/9.x/initials/svg?seed=Fajar+Hidayat",
        departemen: "Operasional",
        posisi: "Supervisor",
        aktif: true,
    },
];

const columns = (
    onDeleteClick: (e: React.MouseEvent, row: Employee) => void,
) => [
    {
        key: "foto" as keyof Employee,
        header: "Foto",
        render: (value: Employee[keyof Employee], row: Employee) => (
            <div className="avatar">
                <div className="w-10 rounded-full ring ring-base-300">
                    <img src={String(value)} alt={row.nama} />
                </div>
            </div>
        ),
    },
    {
        key: "nama" as keyof Employee,
        header: "Nama",
        render: (value: Employee[keyof Employee], row: Employee) => (
            <div>
                <p className="font-medium">{String(value)}</p>
                <p className="text-xs text-base-content/50">{row.email}</p>
            </div>
        ),
    },
    {
        key: "departemen" as keyof Employee,
        header: "Departemen",
    },
    {
        key: "posisi" as keyof Employee,
        header: "Posisi",
    },
    {
        key: "aktif" as keyof Employee,
        header: "Status",
        render: (value: Employee[keyof Employee]) =>
            value ? (
                <span className="badge badge-success badge-sm gap-1">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
                    Aktif
                </span>
            ) : (
                <span className="badge badge-error badge-sm gap-1 opacity-70">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
                    Tidak Aktif
                </span>
            ),
    },
    {
        key: "id" as keyof Employee,
        header: "",
        render: (_value: Employee[keyof Employee], row: Employee) => (
            <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <Link
                    to={`/employee/${row.id}/edit`}
                    onClick={(e) => e.stopPropagation()}
                    className="btn btn-ghost btn-xs"
                    aria-label={`Edit ${row.nama}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                </Link>
                <button
                    className="btn btn-ghost btn-xs text-error"
                    onClick={(e) => onDeleteClick(e, row)}
                    aria-label={`Hapus ${row.nama}`}
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

const PAGE_SIZE = 5;

export default function EmployeeList() {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    function handleDeleteClick(e: React.MouseEvent, row: Employee) {
        e.stopPropagation();
        setDeleteTarget(row);
    }

    async function confirmDelete() {
        if (!deleteTarget) return;
        setIsDeleting(true);
        try {
            // TODO: ganti dengan API call DELETE /employee/:id
            await new Promise((res) => setTimeout(res, 600));
            setEmployees((prev) => prev.filter((e) => e.id !== deleteTarget.id));
            setDeleteTarget(null);
        } finally {
            setIsDeleting(false);
        }
    }

    function cancelDelete() {
        setDeleteTarget(null);
    }

    const filtered = employees.filter(
        (e) =>
            e.nama.toLowerCase().includes(search.toLowerCase()) ||
            e.email.toLowerCase().includes(search.toLowerCase()) ||
            e.departemen.toLowerCase().includes(search.toLowerCase()) ||
            e.posisi.toLowerCase().includes(search.toLowerCase()),
    );

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    function handleSearch(value: string) {
        setSearch(value);
        setCurrentPage(1);
    }

    return (
        <section className="mx-auto w-full max-w-6xl px-2 py-3 md:px-6 md:py-6">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl font-semibold md:text-2xl">Data Karyawan</h1>
                    <p className="mt-1 text-sm text-base-content/50">
                        Total {employees.length} karyawan terdaftar
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
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </label>
                <Link className="btn btn-primary" to={"/employee/create"}>Tambah Karwayan</Link>
            </div>

            <DataTable<Employee>
                columns={columns(handleDeleteClick)}
                data={paginated}
                keyField="id"
                emptyMessage="Tidak ada karyawan yang ditemukan."
                onRowClick={(row) => navigate(`/employee/${row.id}/edit`)}
            />

            {/* Modal konfirmasi hapus */}
            <ConfirmModal
                open={deleteTarget !== null}
                title="Hapus Karyawan"
                message={
                    <>
                        Yakin ingin menghapus{" "}
                        <span className="font-medium text-base-content">{deleteTarget?.nama}</span>?
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
                    Menampilkan {filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} dari {filtered.length} karyawan
                </p>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </div>
        </section>
    );
}