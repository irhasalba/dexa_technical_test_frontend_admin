import type { ReactNode } from "react";
import { Outlet } from "react-router";
import Footer from "../components/footer";
import Navbar from "../components/navbar";

type BaseLayoutProps = {
    children?: ReactNode;
};

export function BaseLayout({ children }: BaseLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col bg-base-100">
            <Navbar />
            <main className="flex-1 px-3 py-4 md:px-6 md:py-6">
                {children ?? <Outlet />}
            </main>
            <Footer />
        </div>
    );
}