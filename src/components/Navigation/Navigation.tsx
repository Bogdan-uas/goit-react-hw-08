import { NavLink, useLocation } from "react-router-dom";
import css from "./Navigation.module.css";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { selectIsLoggedIn } from "../../redux/auth/selectors";
import { selectIsModalOpen, selectIsEditingGlobal } from "../../redux/ui/selectors";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";

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
    const location = useLocation();

    const [underlineCoords, setUnderlineCoords] = useState({ left: 0, width: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

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
                { duration: 4000, style: { borderRadius: "10px", textAlign: "center" } }
            );
        }
    };

    const updateUnderline = useCallback(() => {
        if (!containerRef.current) return;
        const activeLink = containerRef.current.querySelector<HTMLAnchorElement>(
            `a[href="${location.pathname}"]`
        );
        if (activeLink) {
            const rect = activeLink.getBoundingClientRect();
            const containerRect = containerRef.current.getBoundingClientRect();
            setUnderlineCoords({
                left: rect.left - containerRect.left,
                width: rect.width,
            });
        } else {
            setUnderlineCoords({ left: 0, width: 0 });
        }
    }, [location.pathname]);

    useEffect(() => {
        updateUnderline();

        let timeoutId: number;
        const handleResize = () => {
            clearTimeout(timeoutId);
            timeoutId = window.setTimeout(() => {
                updateUnderline();
            }, 50);
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
            clearTimeout(timeoutId);
        };
    }, [updateUnderline, t]);

    return (
        <nav className={css.nav} ref={containerRef}>
            {links.map(
                ({ to, labelKey, requiresAuth }) =>
                    (!requiresAuth || isLoggedIn) && (
                        <NavLink
                            key={to}
                            to={to}
                            onClick={handleNavClick}
                            className={({ isActive }) =>
                                `${css.link} ${isLocked ? css.disabled : ""} ${isActive ? css.active : ""}`
                            }
                        >
                            {t(labelKey)}
                        </NavLink>
                    )
            )}

            <motion.div
                className={css.underline}
                initial={false}
                animate={{ left: underlineCoords.left, width: underlineCoords.width }}
                transition={{ type: "spring", stiffness: 700, damping: 60 }}
            />
        </nav>
    );
}