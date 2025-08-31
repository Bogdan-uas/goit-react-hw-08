import React from "react";
import { useTranslation } from "react-i18next";
import css from "./ErrorPage.module.css";

interface ErrorPageProps {
    error: {
        message?: string;
    };
}

const ErrorPage = ({ error }: ErrorPageProps): React.ReactElement => {
    const { t } = useTranslation();

    const handleRetry = () => {
        window.location.reload();
    };

    return (
        <div className={css.container}>
            <h1 className={css.title}>{t("error.title")}</h1>
            <p className={css.message}>
                {error?.message || t("error.defaultMessage")}
            </p>
            <button onClick={handleRetry} className={css.button}>
                {t("error.retryButton")}
                </button>
        </div>
    );
};

export default ErrorPage;