import { lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import LoginForm from "../../components/LoginForm/LoginForm";

const PageTitleSetter = lazy(() => import("../../components/PageTitleSetter/PageTitleSetter"));

export default function LoginPage() {
    const { t } = useTranslation();

    return (
        <>
            <Suspense fallback={null}>
                <PageTitleSetter title={t("loginPage.title")} />
                <LoginForm />
            </Suspense>
        </>
    );
}