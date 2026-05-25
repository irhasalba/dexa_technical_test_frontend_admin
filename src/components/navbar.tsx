import { useState } from "react";
import { Link } from "react-router";
import NotificationBell from "./notification_bell";
import type { Notification } from "./notification_bell";
import { authLogout } from "../service/auth";

const initialNotifications: Notification[] = [
    { id: "1", title: "Absensi Berhasil", message: "Clock in hari ini pukul 08:00 berhasil dicatat.", time: "08:00", read: false },
    { id: "2", title: "Jadwal Diperbarui", message: "Jadwal kerja minggu ini telah diperbarui oleh HR.", time: "Kemarin", read: false },
    { id: "3", title: "Pengingat Clock Out", message: "Jangan lupa clock out sebelum pukul 17:00.", time: "2 hari lalu", read: true },
];

export default function Navbar() {
    const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

    const onRead = (id: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
    };

    const onReadAll = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    return (
        <>
            <div className="navbar bg-base-100 px-2 shadow-sm md:px-4">
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /> </svg>
                        </div>
                        <ul
                            tabIndex={-1}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-56 p-2 shadow lg:hidden">
                            <li><Link to="/dashboard/employee">Employee</Link></li>
                            <li><Link to="/dashboard/attendance">Attendance</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="navbar-center hidden gap-2 lg:flex">
                    <Link className="btn btn-ghost btn-sm xl:btn-md" to={"/dashboard/employee"}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <span>Employee</span>
                    </Link>
                    <Link className="btn btn-ghost btn-sm xl:btn-md" to={"/dashboard/attendance"}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>Attendance</span>
                    </Link>
                </div>
                <div className="navbar-end gap-1 md:gap-2">
                    <NotificationBell
                        notifications={notifications}
                        onRead={onRead}
                        onReadAll={onReadAll}
                    />
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                            <div className="avatar">
                                <div className="w-8 rounded-full ring ring-base-300 ring-offset-1 ring-offset-base-100">
                                    <img src="https://i.pravatar.cc/64?img=12" alt="Profile" />
                                </div>
                            </div>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-44 border border-base-200 p-2 shadow"
                        >
                            <li><a onClick={authLogout} >Logout</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}