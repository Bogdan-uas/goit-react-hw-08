import React from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import css from "./AuthNav.module.css";

export default function AuthNav(): React.ReactElement {
    const { t } = useTranslation();

    return (
        <nav className={css.nav}>
            <NavLink className={css.link} to="/register">
                {t("authNav.register")}
            </NavLink>
            <NavLink className={css.link} to="/login">
                {t("authNav.login")}
            </NavLink>
        </nav>
    );
}