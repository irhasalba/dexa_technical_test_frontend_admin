type AlertVariant = "alert-info" | "alert-success" | "alert-warning" | "alert-error";

type AlertProps = {
    message: string;
    variant?: AlertVariant;
    className?: string;
};

export default function Alert({ message, variant = "alert-error", className }: AlertProps) {
    return (
        <div role="alert" className={`alert ${variant} py-2 text-sm ${className ?? ""}`}>
            <span>{message}</span>
        </div>
    );
}
