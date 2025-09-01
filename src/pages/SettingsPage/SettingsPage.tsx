import { useTranslation } from "react-i18next";
import css from './SettingsPage.module.css';
import LanguageSelector from "../../components/LanguageSelector/LanguageSelector";
import ThemeToggle from "../../components/ThemeToggle/ThemeToggle";
import { Link } from "react-router-dom";

const SettingsPage = () => {
    const { t } = useTranslation();

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
        </div>
    );
};

export default SettingsPage;