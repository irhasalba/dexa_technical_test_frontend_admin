import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

const UserRole = {
    ADMIN: "admin",
    EMPLOYEE: "employee",
    HR: "hr",
} as const;

type UserRole = (typeof UserRole)[keyof typeof UserRole];

type FormFields = {
    email: string;
    password: string;
    name: string;
    phone: string;
    position: string;
    departement: string;
    photoUrl: string;  // URL foto existing dari server
    role: UserRole | "";
};

type FormErrors = Partial<Record<keyof FormFields, string>>;

const mockEmployees: Record<string, FormFields> = {
    "1": { email: "andi.pratama@example.com", password: "", name: "Andi Pratama", phone: "6281234567890", position: "Frontend Developer", departement: "Teknologi Informasi", photoUrl: "", role: "employee" },
    "2": { email: "budi.santoso@example.com", password: "", name: "Budi Santoso", phone: "6281234567891", position: "Akuntan", departement: "Keuangan", photoUrl: "", role: "employee" },
    "3": { email: "citra.dewi@example.com", password: "", name: "Citra Dewi", phone: "6281234567892", position: "HR Manager", departement: "Sumber Daya Manusia", photoUrl: "", role: "hr" },
};

function validate(form: FormFields): FormErrors {
    const errors: FormErrors = {};

    if (!form.email) {
        errors.email = "Email wajib diisi.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        errors.email = "Format email tidak valid.";
    }

    if (form.password && form.password.length < 8) {
        errors.password = "Password minimal 8 karakter.";
    }

    if (!form.name.trim()) errors.name = "Nama wajib diisi.";
    if (!form.phone.trim()) errors.phone = "Nomor telepon wajib diisi.";
    if (!form.position.trim()) errors.position = "Posisi wajib diisi.";
    if (!form.departement.trim()) errors.departement = "Departemen wajib diisi.";
    if (!form.role) errors.role = "Role wajib dipilih.";

    return errors;
}

export default function EmployeeEdit() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [form, setForm] = useState<FormFields>({
        email: "", password: "", name: "", phone: "",
        position: "", departement: "", photoUrl: "", role: "",
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notFound, setNotFound] = useState(false);
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

    function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0] ?? null;
        setPhotoFile(file);
        if (file) {
            setPhotoPreview(URL.createObjectURL(file));
        } else {
            setPhotoPreview(null);
        }
    }

    function removePhoto() {
        setPhotoFile(null);
        setPhotoPreview(null);
        setForm((prev) => ({ ...prev, photoUrl: "" }));
    }

    useEffect(() => {
        // TODO: integrate with api employee get by id
        const timer = setTimeout(() => {
            const data = id ? mockEmployees[id] : undefined;
            if (data) {
                setForm(data);
            } else {
                setNotFound(true);
            }
            setIsLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, [id]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name as keyof FormFields]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const validationErrors = validate(form);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsSubmitting(true);
        try {
            // TODO: integrate with api employee get by id
            await new Promise((res) => setTimeout(res, 800));
            navigate("/employee");
        } finally {
            setIsSubmitting(false);
        }
    }

    if (isLoading) {
        return (
            <section className="mx-auto w-full max-w-3xl px-2 py-3 md:px-6 md:py-6">
                <div className="flex justify-center py-20">
                    <span className="loading loading-spinner loading-lg" />
                </div>
            </section>
        );
    }

    if (notFound) {
        return (
            <section className="mx-auto w-full max-w-3xl px-2 py-3 md:px-6 md:py-6">
                <div className="flex flex-col items-center gap-4 py-20 text-center">
                    <p className="text-base-content/50">Karyawan tidak ditemukan.</p>
                    <button className="btn btn-ghost btn-sm" onClick={() => navigate("/employee")}>
                        ← Kembali ke daftar
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section className="mx-auto w-full max-w-3xl px-2 py-3 md:px-6 md:py-6">
            <div className="mb-6">
                <h1 className="text-xl font-semibold md:text-2xl">Edit Karyawan</h1>
                <p className="mt-1 text-sm text-base-content/50">Perbarui data karyawan. Kosongkan password jika tidak ingin mengubahnya.</p>
            </div>

            <div className="card border border-base-300 bg-base-100 shadow-sm">
                <form className="card-body gap-5" onSubmit={handleSubmit} noValidate>

                    <h2 className="text-sm font-semibold uppercase tracking-wider text-base-content/40">Informasi Akun</h2>

                    <div className="grid gap-4 sm:grid-cols-2">
                       
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Email <span className="text-error">*</span></legend>
                            <input
                                type="email"
                                name="email"
                                placeholder="employee@dexa.local"
                                className={`input input-bordered w-full ${errors.email ? "input-error" : ""}`}
                                value={form.email}
                                onChange={handleChange}
                                autoComplete="email"
                            />
                            {errors.email && <p className="fieldset-label text-error">{errors.email}</p>}
                        </fieldset>

                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Password <span className="text-base-content/40">(opsional)</span></legend>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Kosongkan jika tidak diubah"
                                    className={`input input-bordered w-full pr-10 ${errors.password ? "input-error" : ""}`}
                                    value={form.password}
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content"
                                    onClick={() => setShowPassword((v) => !v)}
                                    tabIndex={-1}
                                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7s4-7 9-7a10.05 10.05 0 011.875.175M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.54-1.54A11.05 11.05 0 0121 12c0 3-4 7-9 7a9.77 9.77 0 01-3.54-.66M3 3l18 18" /></svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    )}
                                </button>
                            </div>
                            {errors.password && <p className="fieldset-label text-error">{errors.password}</p>}
                        </fieldset>

                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Role <span className="text-error">*</span></legend>
                            <select
                                name="role"
                                className={`select select-bordered w-full ${errors.role ? "select-error" : ""}`}
                                value={form.role}
                                onChange={handleChange}
                            >
                                <option value="" disabled>Pilih role...</option>
                                {Object.values(UserRole).map((r) => (
                                    <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                                ))}
                            </select>
                            {errors.role && <p className="fieldset-label text-error">{errors.role}</p>}
                        </fieldset>
                    </div>

                    <div className="divider my-0" />

                    <h2 className="text-sm font-semibold uppercase tracking-wider text-base-content/40">Data Pribadi</h2>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Nama Lengkap <span className="text-error">*</span></legend>
                            <input
                                type="text"
                                name="name"
                                placeholder="John Doe"
                                className={`input input-bordered w-full ${errors.name ? "input-error" : ""}`}
                                value={form.name}
                                onChange={handleChange}
                            />
                            {errors.name && <p className="fieldset-label text-error">{errors.name}</p>}
                        </fieldset>

                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Nomor Telepon <span className="text-error">*</span></legend>
                            <input
                                type="text"
                                name="phone"
                                placeholder="6285312313123"
                                className={`input input-bordered w-full ${errors.phone ? "input-error" : ""}`}
                                value={form.phone}
                                onChange={handleChange}
                            />
                            {errors.phone && <p className="fieldset-label text-error">{errors.phone}</p>}
                        </fieldset>

                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Posisi <span className="text-error">*</span></legend>
                            <input
                                type="text"
                                name="position"
                                placeholder="Accounting Staff"
                                className={`input input-bordered w-full ${errors.position ? "input-error" : ""}`}
                                value={form.position}
                                onChange={handleChange}
                            />
                            {errors.position && <p className="fieldset-label text-error">{errors.position}</p>}
                        </fieldset>

                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Departemen <span className="text-error">*</span></legend>
                            <input
                                type="text"
                                name="departement"
                                placeholder="finance"
                                className={`input input-bordered w-full ${errors.departement ? "input-error" : ""}`}
                                value={form.departement}
                                onChange={handleChange}
                            />
                            {errors.departement && <p className="fieldset-label text-error">{errors.departement}</p>}
                        </fieldset>

                        <fieldset className="fieldset sm:col-span-2">
                            <legend className="fieldset-legend">Foto <span className="text-base-content/40">(opsional)</span></legend>
                            {(photoPreview ?? form.photoUrl) ? (
                                <div className="flex items-center gap-4">
                                    <div className="avatar">
                                        <div className="w-16 rounded-full ring ring-base-300">
                                            <img src={photoPreview ?? form.photoUrl} alt="Preview foto" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        {photoFile ? (
                                            <>
                                                <p className="text-sm font-medium truncate max-w-xs">{photoFile.name}</p>
                                                <p className="text-xs text-base-content/40">{(photoFile.size / 1024).toFixed(1)} KB</p>
                                            </>
                                        ) : (
                                            <p className="text-xs text-base-content/40">Foto saat ini</p>
                                        )}
                                        <div className="flex gap-2">
                                            <label className="btn btn-ghost btn-xs cursor-pointer">
                                                Ganti foto
                                                <input
                                                    type="file"
                                                    accept="image/png,image/jpeg,image/webp"
                                                    className="hidden"
                                                    onChange={handlePhotoChange}
                                                />
                                            </label>
                                            <button type="button" className="btn btn-ghost btn-xs text-error" onClick={removePhoto}>
                                                Hapus
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-base-300 px-6 py-8 transition hover:border-primary hover:bg-base-200/50">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-sm text-base-content/50">Klik untuk upload foto</span>
                                    <span className="text-xs text-base-content/30">PNG, JPG, WEBP — maks. 2 MB</span>
                                    <input
                                        type="file"
                                        accept="image/png,image/jpeg,image/webp"
                                        className="hidden"
                                        onChange={handlePhotoChange}
                                    />
                                </label>
                            )}
                        </fieldset>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            className="btn btn-ghost"
                            onClick={() => navigate("/employee")}
                            disabled={isSubmitting}
                        >
                            Batal
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                            {isSubmitting && <span className="loading loading-spinner loading-sm" />}
                            Simpan Perubahan
                        </button>
                    </div>

                </form>
            </div>
        </section>
    );
}