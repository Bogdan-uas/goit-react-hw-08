import { lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import RegistrationForm from "../../components/RegistrationForm/RegistrationForm";
import Loader from "../../components/Loader/Loader";

const PageTitleSetter = lazy(() => import("../../components/PageTitleSetter/PageTitleSetter"));

export default function RegistrationPage() {
    const { t } = useTranslation();

    return (
        <Suspense fallback={<Loader />}>
            <PageTitleSetter title={t("registerPage.title")} />
            <RegistrationForm />
        </Suspense>
    );
}