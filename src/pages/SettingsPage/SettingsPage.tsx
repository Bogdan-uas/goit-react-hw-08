import { useDispatch, useSelector } from "react-redux";
import { setDarkMode } from "../../redux/ui/themeSlice";
import { useTranslation } from "react-i18next";
import toast, { Toaster } from "react-hot-toast";
import css from './SettingsPage.module.css';
import LanguageSelector from "../../components/LanguageSelector/LanguageSelector";
import ThemeToggle from "../../components/ThemeToggle/ThemeToggle";
import { Link } from "react-router-dom";
import { selectDarkMode, selectIsModalOpen, selectIsEditingGlobal } from "../../redux/ui/selectors";

const SettingsPage = () => {
    const dispatch = useDispatch();
    const { i18n, t } = useTranslation();
    const darkMode = useSelector(selectDarkMode);
    const isModalOpen = useSelector(selectIsModalOpen);
    const isEditingGlobal = useSelector(selectIsEditingGlobal);

    const isLocked = isModalOpen || isEditingGlobal;

    const showLockedToast = () => {
        toast.error(
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

        if (!darkMode && i18n.language === "en") {
            toast.error(t("settingsPage.toast.alreadyReset"), {
                duration: 4000,
                style: { borderRadius: "10px", textAlign: "center" },
            });
            return;
        }

        const prevDarkMode = darkMode;
        const prevLang = i18n.language;

        dispatch(setDarkMode(false));
        i18n.changeLanguage("en");

        toast.custom(
            (tObj) => {
                if (tObj.visible) {
                    setTimeout(() => toast.dismiss(tObj.id), tObj.duration);
                }

                return (
                    <div className={css.undoToast} style={{ position: "relative" }}>
                        <button
                            onClick={() => toast.dismiss(tObj.id)}
                            className={css.closeButton}
                        >
                            ✕
                        </button>
                        <span className={css.undoText}>{t("settingsPage.toast.resetSuccess")}</span>
                        <button
                            onClick={() => {
                                dispatch(setDarkMode(prevDarkMode));
                                i18n.changeLanguage(prevLang);
                                toast.dismiss(tObj.id);
                            }}
                            className={css.undoButton}
                        >
                            {t("settingsPage.toast.undo")}
                        </button>
                        <div
                            className={css.undoProgress}
                            style={{
                                animationDuration: `${tObj.duration}ms`,
                                animationPlayState: "running",
                            }}
                        />
                    </div>
                );
            },
            { duration: 5000, position: "bottom-center" }
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