import { useDispatch, useSelector } from "react-redux";
import { toggleDarkMode } from "../../redux/ui/themeSlice";
import {
    selectDarkMode,
    selectIsModalOpen,
    selectIsEditingGlobal,
} from "../../redux/ui/selectors";
import { LuSun } from "react-icons/lu";
import { IoMdMoon } from "react-icons/io";
import { useEffect, ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import css from "./ThemeToggle.module.css";
import { useNotify } from "../../helpers/useNotify";

export default function ThemeToggle() {
    const dispatch = useDispatch();
    const notify = useNotify();
    const darkMode = useSelector(selectDarkMode);
    const isModalOpen = useSelector(selectIsModalOpen);
    const isEditingGlobal = useSelector(selectIsEditingGlobal);
    const isLocked = isModalOpen || isEditingGlobal;
    const { t } = useTranslation();

    useEffect(() => {
        document.body.classList.toggle("dark", darkMode);
    }, [darkMode]);

    const handleToggle = () => {
        dispatch(toggleDarkMode());
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (isLocked) {
            e.preventDefault();
            notify.error(
                isModalOpen
                    ? t("themeToggle.errors.closeModalFirst")
                    : t("themeToggle.errors.cannotChangeWhileEditing"),
                {
                    duration: 4000,
                    style: { borderRadius: "10px", textAlign: "center" },
                }
            );
        } else {
            handleToggle();
        }
    };

    return (
        <div className={css.main_container}>
            <p className={css.info_text}>{t("themeToggle.infoText")}</p>
            <div className={`${css.display} ${isLocked ? css.disabled : ""}`}>
                <input
                    className={css.input}
                    type="checkbox"
                    id="toggle"
                    checked={darkMode}
                    onChange={handleChange}
                    aria-checked={darkMode}
                    aria-label={t("themeToggle.ariaLabel")}
                />
                <label className={css.label} htmlFor="toggle" tabIndex={0} role="switch" aria-checked={darkMode}>
                    <div className={css.circle}>
                        <LuSun className={css.sun} aria-hidden="true" />
                        <IoMdMoon className={css.moon} aria-hidden="true" />
                    </div>
                </label>
            </div>
        </div>
    );
}