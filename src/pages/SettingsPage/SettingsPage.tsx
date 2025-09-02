import { useDispatch, useSelector } from "react-redux";
import { setDarkMode } from "../../redux/ui/themeSlice";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import css from './SettingsPage.module.css';
import LanguageSelector from "../../components/LanguageSelector/LanguageSelector";
import ThemeToggle from "../../components/ThemeToggle/ThemeToggle";
import { Link } from "react-router-dom";
import { selectDarkMode } from "../../redux/ui/selectors";

const SettingsPage = () => {
    const dispatch = useDispatch();
    const { i18n, t } = useTranslation();
    const darkMode = useSelector(selectDarkMode);

    const resetSettings = () => {
        if (!darkMode && i18n.language === "en") {
            toast.error(t("settingsPage.toast.alreadyReset"));
            return;
        }
        dispatch(setDarkMode(false));
        i18n.changeLanguage("en");
        toast.success(t("settingsPage.toast.resetSuccess"));
    };

    return (
        <div className={css.settingsPage}>
            <div className={css.container}>
                <div className={css.main_content}>
                    <h2 className={css.title}>{t("settingsPage.title")}</h2>
                    <p className={css.description}>{t("settingsPage.description")}</p>
                </div>
                <Link to="/" className={css.save_button}>{t("settingsPage.goBack")}</Link>
            </div>
            <LanguageSelector />
            <ThemeToggle />
            <div className={css.divider} />
            <button onClick={resetSettings} className={css.reset_button}>
                {t("settingsPage.resetButton")}
            </button>
        </div>
    );
};

export default SettingsPage;