type Column<T> = {
    key: keyof T;
    header: string;
    render?: (value: T[keyof T], row: T) => React.ReactNode;
};

type DataTableProps<T> = {
    columns: Column<T>[];
    data: T[];
    keyField: keyof T;
    loading?: boolean;
    emptyMessage?: string;
    onRowClick?: (row: T) => void;
};

import type React from "react";

export default function DataTable<T>({
    columns,
    data,
    keyField,
    loading = false,
    emptyMessage = "No data available",
    onRowClick,
}: DataTableProps<T>) {
    return (
        <div className="overflow-x-auto rounded-lg border border-base-200">
            <table className="table table-hover w-full">
                <thead className="bg-base-200 text-base-content/70">
                    <tr>
                        {columns.map((col) => (
                            <th key={String(col.key)} className="text-sm font-semibold">
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={columns.length} className="py-10 text-center">
                                <span className="loading loading-spinner loading-md" />
                            </td>
                        </tr>
                    ) : data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="py-10 text-center text-base-content/50">
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        data.map((row) => (
                            <tr
                                key={String(row[keyField])}
                                className={`group${onRowClick ? " cursor-pointer" : ""}`}
                                onClick={onRowClick ? () => onRowClick(row) : undefined}
                            >
                                {columns.map((col) => (
                                    <td key={String(col.key)}>
                                        {col.render
                                            ? col.render(row[col.key], row)
                                            : String(row[col.key] ?? "-")}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
