export type Notification = {
    id: string;
    title: string;
    message: string;
    time: string;
    read: boolean;
};

type NotificationBellProps = {
    notifications: Notification[];
    onRead: (id: string) => void;
    onReadAll: () => void;
};

export default function NotificationBell({ notifications, onRead, onReadAll }: NotificationBellProps) {
    const unreadCount = notifications.filter((n) => !n.read).length;

    return (
        <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                <div className="indicator">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    {unreadCount > 0 && (
                        <span className="badge badge-xs badge-primary indicator-item">
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                    )}
                </div>
            </div>

            <div
                tabIndex={0}
                className="dropdown-content bg-base-100 rounded-box z-10 mt-3 w-80 border border-base-200 shadow-lg"
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-base-200 px-4 py-3">
                    <span className="font-semibold">Notifikasi</span>
                    {unreadCount > 0 && (
                        <button
                            className="btn btn-ghost btn-xs text-primary"
                            onClick={onReadAll}
                        >
                            Tandai semua dibaca
                        </button>
                    )}
                </div>

                {/* List */}
                <ul className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                        <li className="px-4 py-8 text-center text-sm text-base-content/50">
                            Tidak ada notifikasi
                        </li>
                    ) : (
                        notifications.map((notif) => (
                            <li
                                key={notif.id}
                                className={`cursor-pointer border-b border-base-100 px-4 py-3 transition-colors hover:bg-base-200 ${!notif.read ? "bg-primary/5" : ""}`}
                                onClick={() => onRead(notif.id)}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 shrink-0">
                                        {!notif.read ? (
                                            <span className="block h-2 w-2 rounded-full bg-primary" />
                                        ) : (
                                            <span className="block h-2 w-2 rounded-full bg-base-300" />
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className={`text-sm ${!notif.read ? "font-semibold" : "font-normal"}`}>
                                            {notif.title}
                                        </p>
                                        <p className="mt-0.5 truncate text-xs text-base-content/60">
                                            {notif.message}
                                        </p>
                                        <p className="mt-1 text-xs text-base-content/40">{notif.time}</p>
                                    </div>
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
}
