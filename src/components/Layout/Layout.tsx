import { ReactNode, lazy, Suspense, memo } from "react";
import css from "./Layout.module.css";
import Loader from "../Loader/Loader";

const AppBar = memo(lazy(() => import("../AppBar/AppBar")));
const Footer = memo(lazy(() => import("../Footer/Footer")));

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {

    return (
        <div className={css.container}>
            <Suspense fallback={<Loader />}>
                <AppBar />
            </Suspense>
            <main className={css.main}>
                <Suspense fallback={<Loader />}>
                    {children}
                </Suspense>
            </main>
            <Suspense fallback={<Loader />}>
                <Footer />
            </Suspense>
        </div>
    );
}