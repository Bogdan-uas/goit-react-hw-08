import { NavLink } from "react-router-dom";
import css from "./Navigation.module.css";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { selectIsLoggedIn } from "../../redux/auth/selectors";
import { selectIsModalOpen, selectIsEditingGlobal } from "../../redux/ui/selectors";
import { useTranslation } from "react-i18next";

interface LinkItem {
    to: string;
    labelKey: string;
    requiresAuth?: boolean;
}

export default function Navigation(): React.ReactElement {
    const isModalOpen = useSelector(selectIsModalOpen);
    const isEditingGlobal = useSelector(selectIsEditingGlobal);
    const isLocked = isModalOpen || isEditingGlobal;
    const isLoggedIn = useSelector(selectIsLoggedIn);
    const { t } = useTranslation();

    const links: LinkItem[] = [
        { to: "/", labelKey: "app.navigation.home" },
        { to: "/contacts", labelKey: "app.navigation.contacts", requiresAuth: true },
        { to: "/settings", labelKey: "app.navigation.settings" },
    ];

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
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
    };

    const getLinkClass = () => `${css.link} ${isLocked ? css.disabled : ""}`;

    return (
        <nav className={css.nav}>
            {links.map(
                ({ to, labelKey, requiresAuth }) =>
                    (!requiresAuth || isLoggedIn) && (
                        <NavLink
                            key={to}
                            to={to}
                            className={getLinkClass()}
                            onClick={handleNavClick}
                        >
                            {t(labelKey)}
                        </NavLink>
                    )
            )}
        </nav>
    );
}