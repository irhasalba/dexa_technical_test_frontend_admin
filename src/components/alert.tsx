import { useEffect, useState } from "react";

type AlertVariant = "alert-info" | "alert-success" | "alert-warning" | "alert-error";

type AlertProps = {
    message: string;
    variant?: AlertVariant;
    className?: string;
    autoClose?: number;
    onClose?: () => void;
};

export default function Alert({ message, variant = "alert-error", className, autoClose, onClose }: AlertProps) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        setVisible(true);
        if (!autoClose) return;
        const timer = setTimeout(() => {
            setVisible(false);
            onClose?.();
        }, autoClose);
        return () => clearTimeout(timer);
    }, [message, autoClose, onClose]);

    if (!visible) return null;

    return (
        <div role="alert" className={`alert ${variant} py-2 text-sm ${className ?? ""}`}>
            <span>{message}</span>
        </div>
    );
}
