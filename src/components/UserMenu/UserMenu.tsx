import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useTranslation, Trans } from "react-i18next";
import { selectUser } from "../../redux/auth/selectors";
import { selectIsModalOpen, selectIsEditingGlobal } from "../../redux/ui/selectors";
import { apiLogout } from "../../redux/auth/operations";
import { openModal, closeModal } from "../../redux/ui/modalSlice";
import type { AppDispatch } from '../../redux/store';
import { CiLogout } from "react-icons/ci";
import toast from "react-hot-toast";
import css from "./UserMenu.module.css";

export default function UserMenu() {
    const { t } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector(selectUser);
    const isAnyModalOpen = useSelector(selectIsModalOpen);
    const isEditingGlobal = useSelector(selectIsEditingGlobal);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const onLogoutClick = () => {
        if (isEditingGlobal) {
            toast.error(t("userMenu.errors.editing"), {
                duration: 6000,
                style: { borderRadius: "10px", textAlign: "center" },
            });
            return;
        }

        if (isAnyModalOpen) {
            toast.error(t("userMenu.errors.modalOpen"), {
                duration: 6000,
                style: { borderRadius: "10px", textAlign: "center" },
            });
            return;
        }

        dispatch(openModal());
        setIsLogoutModalOpen(true);
    };

    const confirmLogout = () => {
        dispatch(apiLogout());
        dispatch(closeModal());
        setIsLogoutModalOpen(false);
    };

    const cancelLogout = () => {
        dispatch(closeModal());
        setIsLogoutModalOpen(false);
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isLogoutModalOpen) return;

            if (e.key === "Escape") {
                e.preventDefault();
                cancelLogout();
            } else if (e.key === "Enter") {
                e.preventDefault();
                confirmLogout();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isLogoutModalOpen]);

    return (
        <div className={css.userMenu}>
            <p className={css.userdata}>{t("userMenu.welcome", { name: user.name })}</p>
            <button
                className={`${css.button} ${(isAnyModalOpen || isEditingGlobal) ? css.disabled : ""}`}
                type="button"
                onClick={onLogoutClick}
            >
                {t("userMenu.logoutButton")} <CiLogout className={css.icon} />
            </button>

            {isLogoutModalOpen && (
                <div className={css.logout_modal}>
                    <p className={css.logout_text}>
                        <Trans i18nKey="userMenu.modalText" components={{ 1: <b /> }} />
                    </p>
                    <div className={css.logout_buttons}>
                        <button className={css.cancel_button} onClick={cancelLogout}>
                            {t("userMenu.cancel")}
                        </button>
                        <button className={css.confirm_button} onClick={confirmLogout}>
                            {t("userMenu.confirm")}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}