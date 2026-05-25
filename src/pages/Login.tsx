import { useState } from "react";
import { useNavigate } from "react-router";

export default function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // TODO: integrate with API
        setTimeout(() => {
            setLoading(false);
            navigate("/");
        }, 800);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-base-200 px-4">
            <div className="card w-full max-w-sm border border-base-300 bg-base-100 shadow-sm">
                <div className="card-body gap-4">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold">Admin Panel</h1>
                        <p className="mt-1 text-sm text-base-content/60">Masuk ke akun Anda</p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <label className="form-control w-full">
                            <div className="label">
                                <span className="label-text font-medium">Email</span>
                            </div>
                            <input
                                type="email"
                                placeholder="contoh@email.com"
                                className="input input-bordered w-full"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                required
                            />
                        </label>

                        <label className="form-control w-full">
                            <div className="label">
                                <span className="label-text font-medium">Password</span>
                            </div>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="input input-bordered w-full"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                required
                            />
                        </label>

                        <button
                            type="submit"
                            className="btn btn-primary w-full"
                            disabled={loading}
                        >
                            {loading && <span className="loading loading-spinner loading-sm" />}
                            {loading ? "Masuk..." : "Masuk"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
