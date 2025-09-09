import { useSelector } from "react-redux";
import css from './Footer.module.css';
import { FaGithub } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { selectIsModalOpen, selectIsEditingGlobal } from "../../redux/ui/selectors";
import { useNotify } from "../../helpers/useNotify";

const Footer: React.FC = () => {
    const { t } = useTranslation();
    const notify = useNotify();
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

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (isLocked) {
            e.preventDefault();
            showLockedToast();
        }
    };

    return (
        <footer className={css.footer}>
            <div className={css.cont}>
                <p className={css.text}>{t('footer.madeBy')}</p>
                <Link
                    target='_blank'
                    className={`${css.link} ${isLocked ? css.disabled : ""}`}
                    to="https://github.com/Bogdan-uas"
                    onClick={handleLinkClick}
                >
                    <FaGithub className={css.svg} /> Bogdan-uas
                </Link>
            </div>
            <div className={css.cont}>
                <Link
                    target='_blank'
                    className={`${css.link} ${isLocked ? css.disabled : ""}`}
                    to="https://github.com/Bogdan-uas/goit-react-hw-08"
                    onClick={handleLinkClick}
                >
                    {t('footer.repository')}
                </Link>
            </div>
        </footer>
    );
};

export default Footer;