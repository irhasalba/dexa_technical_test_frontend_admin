import { useState } from "react";
import DataTable from "../components/data_table";
import Pagination from "../components/pagination";

type AttendanceStatus = "masuk" | "pulang";

type AttendanceRecord = {
    id: number;
    employeeName: string;
    employeePhoto: string;
    departemen: string;
    date: string;
    time: string;
    status: AttendanceStatus;
};

const STATUS_CONFIG: Record<AttendanceStatus, { label: string; class: string }> = {
    masuk:  { label: "Masuk",  class: "badge-success" },
    pulang: { label: "Pulang", class: "badge-warning" },
};

const mockAttendance: AttendanceRecord[] = [
    { id: 1,  employeeName: "Andi Pratama",   employeePhoto: "https://api.dicebear.com/9.x/initials/svg?seed=Andi+Pratama",   departemen: "Teknologi Informasi",  date: "2026-05-25", time: "08:02", status: "masuk" },
    { id: 2,  employeeName: "Andi Pratama",   employeePhoto: "https://api.dicebear.com/9.x/initials/svg?seed=Andi+Pratama",   departemen: "Teknologi Informasi",  date: "2026-05-25", time: "17:05", status: "pulang" },
    { id: 3,  employeeName: "Budi Santoso",   employeePhoto: "https://api.dicebear.com/9.x/initials/svg?seed=Budi+Santoso",   departemen: "Keuangan",            date: "2026-05-25", time: "08:15", status: "masuk" },
    { id: 4,  employeeName: "Budi Santoso",   employeePhoto: "https://api.dicebear.com/9.x/initials/svg?seed=Budi+Santoso",   departemen: "Keuangan",            date: "2026-05-25", time: "17:00", status: "pulang" },
    { id: 5,  employeeName: "Citra Dewi",     employeePhoto: "https://api.dicebear.com/9.x/initials/svg?seed=Citra+Dewi",     departemen: "Sumber Daya Manusia", date: "2026-05-25", time: "07:58", status: "masuk" },
    { id: 6,  employeeName: "Deni Kurniawan", employeePhoto: "https://api.dicebear.com/9.x/initials/svg?seed=Deni+Kurniawan", departemen: "Teknologi Informasi",  date: "2026-05-25", time: "08:30", status: "masuk" },
    { id: 7,  employeeName: "Deni Kurniawan", employeePhoto: "https://api.dicebear.com/9.x/initials/svg?seed=Deni+Kurniawan", departemen: "Teknologi Informasi",  date: "2026-05-25", time: "17:10", status: "pulang" },
    { id: 8,  employeeName: "Eka Rahayu",     employeePhoto: "https://api.dicebear.com/9.x/initials/svg?seed=Eka+Rahayu",     departemen: "Pemasaran",           date: "2026-05-25", time: "08:10", status: "masuk" },
    { id: 9,  employeeName: "Fajar Hidayat",  employeePhoto: "https://api.dicebear.com/9.x/initials/svg?seed=Fajar+Hidayat",  departemen: "Operasional",         date: "2026-05-24", time: "08:00", status: "masuk" },
    { id: 10, employeeName: "Fajar Hidayat",  employeePhoto: "https://api.dicebear.com/9.x/initials/svg?seed=Fajar+Hidayat",  departemen: "Operasional",         date: "2026-05-24", time: "17:00", status: "pulang" },
    { id: 11, employeeName: "Andi Pratama",   employeePhoto: "https://api.dicebear.com/9.x/initials/svg?seed=Andi+Pratama",   departemen: "Teknologi Informasi",  date: "2026-05-24", time: "08:05", status: "masuk" },
    { id: 12, employeeName: "Andi Pratama",   employeePhoto: "https://api.dicebear.com/9.x/initials/svg?seed=Andi+Pratama",   departemen: "Teknologi Informasi",  date: "2026-05-24", time: "17:00", status: "pulang" },
];

const columns: {
    key: keyof AttendanceRecord;
    header: string;
    render?: (value: AttendanceRecord[keyof AttendanceRecord], row: AttendanceRecord) => React.ReactNode;
}[] = [
    {
        key: "employeeName",
        header: "Karyawan",
        render: (value, row) => (
            <div className="flex items-center gap-3">
                <div className="avatar">
                    <div className="w-8 rounded-full ring ring-base-300">
                        <img src={row.employeePhoto} alt={String(value)} />
                    </div>
                </div>
                <div>
                    <p className="font-medium">{String(value)}</p>
                    <p className="text-xs text-base-content/50">{row.departemen}</p>
                </div>
            </div>
        ),
    },
    {
        key: "date",
        header: "Tanggal",
        render: (value) => {
            const d = new Date(String(value));
            return d.toLocaleDateString("id-ID", { weekday: "short", day: "2-digit", month: "short", year: "numeric" });
        },
    },
    {
        key: "time",
        header: "Waktu",
        render: (value) => <span className="font-mono text-sm">{String(value)}</span>,
    },
    {
        key: "status",
        header: "Status",
        render: (value) => {
            const cfg = STATUS_CONFIG[value as AttendanceStatus];
            return (
                <span className={`badge badge-sm gap-1 ${cfg.class}`}>
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
                    {cfg.label}
                </span>
            );
        },
    },
];

const PAGE_SIZE = 8;

const ALL_STATUSES: (AttendanceStatus | "")[] = ["", "masuk", "pulang"];

export default function Attendance() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<AttendanceStatus | "">("");
    const [currentPage, setCurrentPage] = useState(1);

    const filtered = mockAttendance.filter((r) => {
        const matchSearch =
            r.employeeName.toLowerCase().includes(search.toLowerCase()) ||
            r.departemen.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === "" || r.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    function handleSearch(value: string) {
        setSearch(value);
        setCurrentPage(1);
    }

    function handleStatusFilter(value: AttendanceStatus | "") {
        setStatusFilter(value);
        setCurrentPage(1);
    }

    const summary = {
        masuk:  mockAttendance.filter((r) => r.status === "masuk").length,
        pulang: mockAttendance.filter((r) => r.status === "pulang").length,
    };

    return (
        <section className="mx-auto w-full max-w-6xl px-2 py-3 md:px-6 md:py-6">
            <div className="mb-6">
                <h1 className="text-xl font-semibold md:text-2xl">Data Absensi</h1>
                <p className="mt-1 text-sm text-base-content/50">Rekap kehadiran seluruh karyawan</p>
            </div>

            {/* Summary cards */}
            <div className="mb-6 grid grid-cols-2 gap-3">
                {([
                    { key: "masuk",  label: "Masuk",  class: "text-success" },
                    { key: "pulang", label: "Pulang", class: "text-warning" },
                ] as const).map((item) => (
                    <button
                        key={item.key}
                        className={`card border cursor-pointer text-left transition-colors ${
                            statusFilter === item.key
                                ? "border-current bg-base-200"
                                : "border-base-300 bg-base-100 hover:bg-base-200/50"
                        } ${item.class}`}
                        onClick={() => handleStatusFilter(statusFilter === item.key ? "" : item.key)}
                    >
                        <div className="card-body p-4">
                            <p className="text-2xl font-bold">{summary[item.key]}</p>
                            <p className="text-sm font-medium opacity-70">{item.label}</p>
                        </div>
                    </button>
                ))}
            </div>

            {/* Toolbar */}
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
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

                <select
                    className="select select-bordered w-full sm:w-40"
                    value={statusFilter}
                    onChange={(e) => handleStatusFilter(e.target.value as AttendanceStatus | "")}
                >
                    {ALL_STATUSES.map((s) => (
                        <option key={s} value={s}>
                            {s === "" ? "Semua Status" : STATUS_CONFIG[s].label}
                        </option>
                    ))}
                </select>
            </div>

            <DataTable<AttendanceRecord>
                columns={columns}
                data={paginated}
                keyField="id"
                emptyMessage="Tidak ada data absensi yang ditemukan."
            />

            <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
                <p className="text-sm text-base-content/50">
                    Menampilkan {filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} dari {filtered.length} data
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
