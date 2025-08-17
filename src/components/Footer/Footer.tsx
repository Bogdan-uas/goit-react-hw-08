import css from './Footer.module.css';
import { FaGithub } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
    const { t } = useTranslation();

    return (
        <footer className={css.footer}>
            <div className={css.cont}>
                <p className={css.text}>{t('footer.madeBy')}</p>
                <Link
                    target='_blank'
                    className={css.link}
                    to="https://github.com/Bogdan-uas"
                >
                    <FaGithub className={css.svg} /> Bogdan-uas
                </Link>
            </div>
            <div className={css.cont}>
                <Link
                    target='_blank'
                    className={css.link}
                    to="https://github.com/Bogdan-uas/goit-react-hw-08"
                >
                    {t('footer.repository')}
                </Link>
            </div>
        </footer>
    );
};

export default Footer;