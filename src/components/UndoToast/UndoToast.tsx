import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectIsModalOpen, selectIsEditingGlobal } from "../../redux/ui/selectors";
import { setDarkMode } from "../../redux/ui/themeSlice";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom"; // ✅ add this
import toast from "react-hot-toast";
import css from "../../pages/SettingsPage/SettingsPage.module.css";

interface UndoToastProps {
    id: string;
    duration: number;
    prevDarkMode: boolean;
    prevLang: string;
}

export const UndoToast = ({ id, duration, prevDarkMode, prevLang }: UndoToastProps) => {
    const dispatch = useDispatch();
    const { i18n, t } = useTranslation();
    const isModalOpen = useSelector(selectIsModalOpen);
    const isEditingGlobal = useSelector(selectIsEditingGlobal);
    const location = useLocation(); // ✅ track current route

    const isLocked = isModalOpen || isEditingGlobal;

    const [timeLeft, setTimeLeft] = useState(Math.ceil(duration / 1000));

    useEffect(() => {
        if (isLocked) {
            toast.dismiss(id);
        }
    }, [isLocked, id]);

    useEffect(() => {
        if (location.pathname !== "/settings") {
            toast.dismiss(id);
        }
    }, [location, id]);

    useEffect(() => {
        if (isLocked) return;

        const interval = setInterval(() => {
            setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(interval);
    }, [isLocked]);

    useEffect(() => {
        if (timeLeft === 0) {
            toast.dismiss(id);
        }
    }, [timeLeft, id]);

    if (timeLeft === 0) return null;

    return (
        <div className={css.undoToast}>
            <button
                onClick={() => toast.dismiss(id)}
                className={`${css.closeButton} ${isLocked ? css.disabled : ""}`}
            >
                ✕
            </button>
            <span className={css.undoText}>{t("settingsPage.toast.resetSuccess")}</span>
            <button
                onClick={() => {
                    dispatch(setDarkMode(prevDarkMode));
                    i18n.changeLanguage(prevLang);
                    toast.dismiss(id);
                }}
                className={`${css.undoButton} ${isLocked ? css.disabled : ""}`}
            >
                {t("settingsPage.toast.undo")}
            </button>
            <div
                className={css.undoProgress}
                style={{
                    animationDuration: `${duration}ms`,
                }}
            >
                <span className={css.timer}>{timeLeft}s</span>
            </div>
        </div>
    );
};