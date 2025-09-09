import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { setDarkMode } from "../../redux/ui/themeSlice";
import { setNotifications } from "../../redux/ui/notificationsSlice";
import { useTranslation } from "react-i18next";
import css from './SettingsPage.module.css';
import LanguageSelector from "../../components/LanguageSelector/LanguageSelector";
import ThemeToggle from "../../components/ThemeToggle/ThemeToggle";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { selectDarkMode, selectIsModalOpen, selectIsEditingGlobal, selectNotificationsEnabled } from "../../redux/ui/selectors";
import { UndoToast } from "../../components/UndoToast/UndoToast";
import NotificationToggle from "../../components/NotificationToggle/NotificationToggle";
import { useNotify } from "../../helpers/useNotify";

const SettingsPage = () => {
    const dispatch = useDispatch();
    const { i18n, t } = useTranslation();
    const notify = useNotify();
    const darkMode = useSelector(selectDarkMode);
    const notificationsEnabled = useSelector(selectNotificationsEnabled);
    const isModalOpen = useSelector(selectIsModalOpen);
    const isEditingGlobal = useSelector(selectIsEditingGlobal);

    const isLocked = isModalOpen || isEditingGlobal;

    const showLockedToast = () => {
        notify.error(
            isEditingGlobal
                ? t("settingsPage.toast.editingLocked")
                : t("settingsPage.toast.modalOpenLocked"),
            { duration: 4000, style: { borderRadius: "10px", textAlign: "center" } }
        );
    };

    const resetSettings = () => {
        if (isLocked) {
            showLockedToast();
            return;
        }

        if (!darkMode && i18n.language === "en" && notificationsEnabled) {
            notify.error(t("settingsPage.toast.alreadyReset"), {
                duration: 4000,
                style: { borderRadius: "10px", textAlign: "center" },
            });
            return;
        }

        const prevDarkMode = darkMode;
        const prevLang = i18n.language;
        const prevNotifications = notificationsEnabled;

        dispatch(setDarkMode(false));
        dispatch(setNotifications(true));
        i18n.changeLanguage("en");

        const duration = 5000;

        notify.dismiss();

        const toastId = `undo-toast-${uuidv4()}`;

        toast.custom(
            <UndoToast
                id={toastId}
                duration={duration}
                prevDarkMode={prevDarkMode}
                prevLang={prevLang}
                prevNotifications={prevNotifications}
            />,
            { id: toastId, duration: Infinity, position: "bottom-center" }
        );
    };

    const onGoBackClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (isLocked) {
            e.preventDefault();
            showLockedToast();
        }
    };

    return (
        <div className={css.settingsPage}>
            <div className={css.container}>
                <div className={css.main_content}>
                    <h2 className={css.title}>{t("settingsPage.title")}</h2>
                    <p className={css.description}>{t("settingsPage.description")}</p>
                </div>
                <Link
                    to="/"
                    className={`${css.save_button} ${isLocked ? css.disabled : ""}`}
                    onClick={onGoBackClick}
                >
                    {t("settingsPage.goBack")}
                </Link>
            </div>
            <LanguageSelector />
            <ThemeToggle />
            <NotificationToggle />
            <div className={css.divider} />
            <button
                onClick={resetSettings}
                className={`${css.reset_button} ${isLocked ? css.disabled : ""}`}
            >
                {t("settingsPage.resetButton")}
            </button>
        </div>
    );
};

export default SettingsPage;