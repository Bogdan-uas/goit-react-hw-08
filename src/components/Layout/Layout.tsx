import { ReactNode, lazy, Suspense } from "react";
import css from "./Layout.module.css";

const AppBar = lazy(() => import("../AppBar/AppBar"));

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <div className={css.container}>
            <Suspense fallback={<div>Loading...</div>}>
                <AppBar />
            </Suspense>
            <main className={css.main}>
                {children}
            </main>
        </div>
    );
}