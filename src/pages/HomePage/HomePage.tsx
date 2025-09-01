import { lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import css from "./HomePage.module.css";
import Loader from "../../components/Loader/Loader";
import { NavLink } from "react-router-dom";

const PageTitleSetter = lazy(() => import("../../components/PageTitleSetter/PageTitleSetter"));

export default function HomePage() {
    const { t } = useTranslation();

    return (
        <div className={css.home_container}>
            <Suspense fallback={<Loader />}>
                <PageTitleSetter title={t("home.title")} />
            </Suspense>

            <h1 className={css.main_title}>{t("home.title")}</h1>
            <div className={css.button_container}>
                <NavLink to="/contacts" className={css.button}>
                    {t("contactsPage.title")}
                </NavLink>
                <NavLink to="/settings" className={css.button}>
                    {t("settingsPage.title")}
                </NavLink>
            </div>
            <p className={css.main_description}>{t("home.description")}</p>
            <span className={css.emoji}>🥸</span>
        </div>
    );
}