import { useEffect, useRef } from "react";

type ConfirmModalProps = {
    open: boolean;
    title: string;
    message: React.ReactNode;
    confirmLabel?: string;
    confirmVariant?: "btn-error" | "btn-warning" | "btn-primary";
    isLoading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
};

import type React from "react";

export default function ConfirmModal({
    open,
    title,
    message,
    confirmLabel = "Konfirmasi",
    confirmVariant = "btn-error",
    isLoading = false,
    onConfirm,
    onCancel,
}: ConfirmModalProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        if (open) {
            dialog.showModal();
        } else {
            dialog.close();
        }
    }, [open]);

    return (
        <dialog ref={dialogRef} className="modal">
            <div className="modal-box">
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-base-content/70">{message}</p>
                <div className="modal-action">
                    <button className="btn btn-ghost" onClick={onCancel} disabled={isLoading}>
                        Batal
                    </button>
                    <button className={`btn ${confirmVariant}`} onClick={onConfirm} disabled={isLoading}>
                        {isLoading && <span className="loading loading-spinner loading-sm" />}
                        {confirmLabel}
                    </button>
                </div>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button onClick={onCancel}>close</button>
            </form>
        </dialog>
    );
}
