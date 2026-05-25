import { useState, useEffect } from "react";
import DataTable from "../components/data_table";
import Pagination from "../components/pagination";
import Alert from "../components/alert";
import { getAttendances } from "../service/attendance";
import type { AttendanceItemDto, AttendanceListMetaDto } from "../service/attendance";

const PAGE_SIZE = 10;

export default function Attendance() {
    const [attendances, setAttendances] = useState<AttendanceItemDto[]>([]);
    const [meta, setMeta] = useState<AttendanceListMetaDto>({ page: 1, limit: PAGE_SIZE, total: 0, totalPages: 0 });
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Debounce search
    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedSearch(search);
            setCurrentPage(1);
        }, 400);
        return () => clearTimeout(t);
    }, [search]);

    // Fetch data
    useEffect(() => {
        setLoading(true);
        setError(null);
        getAttendances({
            page: currentPage,
            limit: PAGE_SIZE,
            employeeName: debouncedSearch || undefined,
            startDate: startDate || undefined,
            endDate: endDate || undefined,
        })
            .then((res) => {
                setAttendances(res.data.data);
                setMeta(res.data.meta);
            })
            .catch((err: unknown) => {
                const msg =
                    (err as { response?: { data?: { message?: string } } })?.response?.data?.message
                    ?? "Gagal memuat data absensi.";
                setError(msg);
            })
            .finally(() => setLoading(false));
    }, [currentPage, debouncedSearch, startDate, endDate]);

    function handleDateFilter(start: string, end: string) {
        setStartDate(start);
        setEndDate(end);
        setCurrentPage(1);
    }

    const checkInCount  = attendances.filter((a) => a.status === "check_in").length;
    const checkOutCount = attendances.filter((a) => a.status === "check_out").length;

    const columns: {
        key: keyof AttendanceItemDto;
        header: string;
        render?: (value: AttendanceItemDto[keyof AttendanceItemDto], row: AttendanceItemDto) => React.ReactNode;
    }[] = [
        {
            key: "employees",
            header: "Karyawan",
            render: (_, row) => (
                <div className="flex items-center gap-3">
                    <div className="avatar">
                        <div className="w-8 rounded-full ring ring-base-300">
                            <img
                                src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(row.employees.name)}`}
                                alt={row.employees.name}
                            />
                        </div>
                    </div>
                    <div>
                        <p className="font-medium">{row.employees.name}</p>
                        <p className="text-xs text-base-content/50">{row.employees.department ?? row.employees.position}</p>
                    </div>
                </div>
            ),
        },
        {
            key: "attendance_date",
            header: "Tanggal",
            render: (value) => {
                const d = new Date(String(value));
                return d.toLocaleDateString("id-ID", { weekday: "short", day: "2-digit", month: "short", year: "numeric" });
            },
        },
        {
            key: "check_in_time",
            header: "Jam Masuk",
            render: (value) => {
                if (!value) return <span className="text-base-content/30">—</span>;
                const d = new Date(String(value));
                return <span className="font-mono text-sm">{d.toTimeString().slice(0, 5)}</span>;
            },
        },
        {
            key: "check_out_time",
            header: "Jam Pulang",
            render: (value) => {
                if (!value) return <span className="text-base-content/30">—</span>;
                const d = new Date(String(value));
                return <span className="font-mono text-sm">{d.toTimeString().slice(0, 5)}</span>;
            },
        },
        {
            key: "status",
            header: "Status",
            render: (value) => {
                const isCheckIn = value === "check_in";
                return (
                    <span className={`badge badge-sm gap-1 ${isCheckIn ? "badge-success" : "badge-warning"}`}>
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
                        {isCheckIn ? "Masuk" : "Pulang"}
                    </span>
                );
            },
        },
    ];

    return (
        <section className="mx-auto w-full max-w-6xl px-2 py-3 md:px-6 md:py-6">
            <div className="mb-6">
                <h1 className="text-xl font-semibold md:text-2xl">Data Absensi</h1>
                <p className="mt-1 text-sm text-base-content/50">Rekap kehadiran seluruh karyawan</p>
            </div>

            {/* Summary cards */}
            <div className="mb-6 grid grid-cols-2 gap-3">
                <div className="card border border-base-300 bg-base-100">
                    <div className="card-body p-4">
                        <p className="text-2xl font-bold text-success">{checkInCount}</p>
                        <p className="text-sm font-medium opacity-70">Masuk (halaman ini)</p>
                    </div>
                </div>
                <div className="card border border-base-300 bg-base-100">
                    <div className="card-body p-4">
                        <p className="text-2xl font-bold text-warning">{checkOutCount}</p>
                        <p className="text-sm font-medium opacity-70">Pulang (halaman ini)</p>
                    </div>
                </div>
            </div>

            {error && <Alert message={error} className="mb-4" />}

            {/* Toolbar */}
            <div className="mb-4 flex flex-wrap gap-3 items-center">
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

                <div className="flex flex-wrap gap-2 items-center">
                    <input
                        type="date"
                        className="input input-bordered"
                        value={startDate}
                        onChange={(e) => handleDateFilter(e.target.value, endDate)}
                        title="Dari tanggal"
                    />
                    <span className="text-sm text-base-content/50">s/d</span>
                    <input
                        type="date"
                        className="input input-bordered"
                        value={endDate}
                        onChange={(e) => handleDateFilter(startDate, e.target.value)}
                        title="Sampai tanggal"
                    />
                    {(startDate || endDate) && (
                        <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => handleDateFilter("", "")}
                        >
                            Reset
                        </button>
                    )}
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-16">
                    <span className="loading loading-spinner loading-lg" />
                </div>
            ) : (
                <DataTable<AttendanceItemDto>
                    columns={columns}
                    data={attendances}
                    keyField="id"
                    emptyMessage="Tidak ada data absensi yang ditemukan."
                />
            )}

            <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
                <p className="text-sm text-base-content/50">
                    Menampilkan {meta.total === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, meta.total)} dari {meta.total} data
                </p>
                <Pagination
                    currentPage={currentPage}
                    totalPages={meta.totalPages}
                    onPageChange={setCurrentPage}
                />
            </div>
        </section>
    );
}
