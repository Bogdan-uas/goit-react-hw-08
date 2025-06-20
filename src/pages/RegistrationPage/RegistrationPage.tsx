import { lazy, Suspense } from "react";
import RegistrationForm from "../../components/RegistrationForm/RegistrationForm";

const PageTitleSetter = lazy(() => import("../../components/PageTitleSetter/PageTitleSetter"));

export default function RegistrationPage() {
return (
    <Suspense fallback={null}>
        <PageTitleSetter title="Registration Page" />
        <RegistrationForm />
    </Suspense>
);
}