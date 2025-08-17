import { ReactNode, lazy, Suspense, memo } from "react";
import { useTranslation } from "react-i18next";
import css from "./Layout.module.css";

const AppBar = memo(lazy(() => import("../AppBar/AppBar")));

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    const { t } = useTranslation("app");

    return (
        <div className={css.container}>
            <Suspense fallback={<div className={css.loading}>{t("layout.loading")}</div>}>
                <AppBar />
            </Suspense>
            <main className={css.main}>
                <Suspense fallback={<div className={css.loading}>{t("layout.loading")}</div>}>
                    {children}
                </Suspense>
            </main>
        </div>
    );
}