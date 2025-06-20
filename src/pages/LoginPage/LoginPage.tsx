import { lazy, Suspense } from "react";
import LoginForm from "../../components/LoginForm/LoginForm";

const PageTitleSetter = lazy(() => import("../../components/PageTitleSetter/PageTitleSetter"));

export default function LoginPage() {
return (
    <>
    <Suspense fallback={null}>
        <PageTitleSetter title="Login Page" />
        <LoginForm />
    </Suspense>
    </>
);
}