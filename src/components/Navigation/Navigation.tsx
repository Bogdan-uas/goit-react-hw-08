import { NavLink } from "react-router-dom";
import css from "./Navigation.module.css";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../../redux/auth/selectors";
import { useTranslation } from "react-i18next";

export default function Navigation(): React.ReactElement {
    const isLoggedIn = useSelector(selectIsLoggedIn);
    const { t } = useTranslation();

    return (
        <div>
            <nav className={css.nav}>
                <NavLink className={css.link} to="/">
                    {t("app.navigation.home")}
                </NavLink>
                {isLoggedIn && (
                    <NavLink className={css.link} to="/contacts">
                        {t("app.navigation.contacts")}
                    </NavLink>
                )}
            </nav>
        </div>
    );
}