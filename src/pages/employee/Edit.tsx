import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Alert from "../../components/alert";
import { getEmployee, updateEmployee, uploadEmployeePhoto } from "../../service/employee";

const UserRole = {
    ADMIN: "admin",
    EMPLOYEE: "employee",
} as const;

type UserRole = (typeof UserRole)[keyof typeof UserRole];

type FormFields = {
    email: string;
    name: string;
    phone: string;
    position: string;
    departement: string;
    photoUrl: string;
    role: UserRole | "";
};

type FormErrors = Partial<Record<keyof FormFields, string>>;

function validate(form: FormFields): FormErrors {
    const errors: FormErrors = {};

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        errors.email = "Format email tidak valid.";
    }

    if (!form.name.trim()) errors.name = "Nama wajib diisi.";
    if (!form.phone.trim()) errors.phone = "Nomor telepon wajib diisi.";
    if (!form.position.trim()) errors.position = "Posisi wajib diisi.";
    if (!form.departement.trim()) errors.departement = "Departemen wajib diisi.";

    return errors;
}

export default function EmployeeEdit() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [form, setForm] = useState<FormFields>({
        email: "", name: "", phone: "",
        position: "", departement: "", photoUrl: "", role: "",
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notFound, setNotFound] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);
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
        if (!id) return;
        setIsLoading(true);
        getEmployee(id)
            .then((res) => {
                const d = res.data;
                setForm({
                    email: "",
                    name: d.name,
                    phone: d.phone ?? "",
                    position: d.position,
                    departement: d.department ?? "",
                    photoUrl: d.photo_url ?? "",
                    role: "",
                });
            })
            .catch((err) => {
                if (err?.response?.status === 404) setNotFound(true);
                else setSubmitError("Gagal memuat data karyawan.");
            })
            .finally(() => setIsLoading(false));
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
        setSubmitError(null);
        try {
            await updateEmployee(id!, {
                name: form.name,
                phone: form.phone,
                position: form.position,
                departement: form.departement,
                ...(form.email ? { email: form.email } : {}),
                ...(form.role ? { role: form.role as "employee" | "admin" } : {}),
            });
            if (photoFile) {
                await uploadEmployeePhoto(id!, photoFile);
            }
            setSubmitSuccess(true);
        } catch (err: unknown) {
            const msg =
                (err as { response?: { data?: { message?: string } } })?.response?.data?.message
                ?? "Gagal menyimpan perubahan. Silakan coba lagi.";
            setSubmitError(msg);
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
                    <button className="btn btn-ghost btn-sm" onClick={() => navigate("/dashboard/employee")}>
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

            {submitError && <Alert message={submitError} className="mb-4" />}
            {submitSuccess && (
                <Alert
                    message="Perubahan berhasil disimpan!"
                    variant="alert-success"
                    autoClose={2000}
                    onClose={() => navigate("/dashboard/employee")}
                    className="mb-4"
                />
            )}

            <div className="card border border-base-300 bg-base-100 shadow-sm">
                <form className="card-body gap-5" onSubmit={handleSubmit} noValidate>

                    <h2 className="text-sm font-semibold uppercase tracking-wider text-base-content/40">Informasi Akun</h2>

                    <div className="grid gap-4 sm:grid-cols-2">
                       
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Email <span className="text-base-content/40">(opsional, isi untuk mengubah)</span></legend>
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
                            <legend className="fieldset-legend">Role <span className="text-base-content/40">(opsional, isi untuk mengubah)</span></legend>
                            <select
                                name="role"
                                className={`select select-bordered w-full ${errors.role ? "select-error" : ""}`}
                                value={form.role}
                                onChange={handleChange}
                            >
                                <option value="">— Tidak diubah —</option>
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
                            onClick={() => navigate("/dashboard/employee")}
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