import { lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import css from "./HomePage.module.css";
import Loader from "../../components/Loader/Loader";

const PageTitleSetter = lazy(() => import("../../components/PageTitleSetter/PageTitleSetter"));

export default function HomePage() {
    const { t } = useTranslation();

    return (
        <div className={css.home_container}>
            <Suspense fallback={<Loader />}>
                <PageTitleSetter title={t("home.title")} />
            </Suspense>

            <h1 className={css.main_title}>{t("home.description")}</h1>
            <p className={css.emoji}>🥸</p>
        </div>
    );
}