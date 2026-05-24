import { useEffect, useMemo, useState } from "react";

export default function Home() {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setNow(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const timeText = useMemo(
        () =>
            now.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            }),
        [now],
    );

    const fullDateText = useMemo(
        () =>
            now.toLocaleDateString("en-US", {
                weekday: "short",
                day: "2-digit",
                month: "short",
                year: "numeric",
            }),
        [now],
    );

    return (
        <section className="mx-auto w-full max-w-6xl px-2 py-3 md:px-6 md:py-6">
            <h1 className="mb-4 text-xl font-semibold md:text-2xl">Live Attendance</h1>

            <div className="card mx-auto w-full max-w-5xl border border-base-300 bg-base-100 shadow-sm">
                <div className="card-body p-0">
                    <div className="space-y-1 px-6 py-8 text-center md:px-10">
                        <p className="text-4xl font-semibold tracking-wide md:text-5xl">{timeText}</p>
                        <p className="text-sm text-base-content/70 md:text-base">{fullDateText}</p>
                    </div>

                    <div className="divider m-0" />

                    <div className="space-y-6 px-6 py-8 md:px-10 md:py-10">
                        <div className="text-center">
                            <p className="text-base text-base-content/70">Schedule, 25 May 2026</p>
                            <p className="text-3xl font-semibold">Work From Office</p>
                            <p className="mt-1 text-4xl font-bold">08:00 AM - 05:00 PM</p>
                            <a className="link link-primary mt-2 inline-block text-lg">See 1 other attendance location</a>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="notes" className="text-2xl font-semibold">
                                Notes (optional)
                            </label>
                            <textarea
                                id="notes"
                                placeholder="Text"
                                className="textarea textarea-bordered h-32 w-full resize-none text-lg"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-6">
                            <button className="btn btn-primary btn-lg">Clock In</button>
                            <button className="btn btn-primary btn-lg">Clock Out</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}