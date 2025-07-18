import { ChangeEvent } from "react";
import { NavLink } from "react-router-dom";
import css from "./Navigation.module.css";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { selectIsLoggedIn } from "../../redux/auth/selectors";
import { selectIsModalOpen, selectIsEditingGlobal } from "../../redux/ui/selectors";
import { useTranslation } from "react-i18next";

export default function Navigation(): React.ReactElement {
    const isModalOpen = useSelector(selectIsModalOpen);
    const isEditingGlobal = useSelector(selectIsEditingGlobal);
    const isLocked = isModalOpen || isEditingGlobal;
    const isLoggedIn = useSelector(selectIsLoggedIn);
    const { t } = useTranslation();

    return (
        <div>
            <nav className={css.nav}>
                <NavLink
                    className={`${css.link} ${isLocked ? css.disabled : ""}`}
                    to="/"
                    onClick={(e) => {
                        if (isLocked) {
                            e.preventDefault();
                            toast.error(
                                isModalOpen
                                    ? t("navigation.errors.closeModalFirst")
                                    : t("navigation.errors.cannotNavigateWhileEditing"),
                                {
                                    duration: 4000,
                                    style: { borderRadius: "10px", textAlign: "center" },
                                }
                            );
                        }
                    }}
                >
                    {t("app.navigation.home")}
                </NavLink>
                {isLoggedIn && (
                    <NavLink
                        to="/contacts"
                        className={`${css.link} ${isLocked ? css.disabled : ""}`}
                        onClick={(e) => {
                            if (isLocked) {
                                e.preventDefault();
                                toast.error(
                                    isModalOpen
                                        ? t("navigation.errors.closeModalFirst")
                                        : t("navigation.errors.cannotNavigateWhileEditing"),
                                    {
                                        duration: 4000,
                                        style: { borderRadius: "10px", textAlign: "center" },
                                    }
                                );
                            }
                        }}
                    >
                        {t("app.navigation.contacts")}
                    </NavLink>
                )}
            </nav>
        </div >
    );
}