import { memo } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import css from "./AuthNav.module.css";

function AuthNav(): React.ReactElement {
    const { t } = useTranslation();

    return (
        <nav className={css.nav}>
            <NavLink
                to="/register"
                className={({ isActive }) => clsx(css.link, isActive && css.active)}
            >
                {t("authNav.register")}
            </NavLink>
            <NavLink
                to="/login"
                className={({ isActive }) => clsx(css.link, isActive && css.active)}
            >
                {t("authNav.login")}
            </NavLink>
        </nav>
    );
}

export default memo(AuthNav);