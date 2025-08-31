import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectIsLoggedIn } from "../../redux/auth/selectors";

interface RestrictedRouteProps {
    children: ReactNode;
}

export default function RestrictedRoute({ children }: RestrictedRouteProps) {
    const isLoggedIn = useSelector(selectIsLoggedIn);

    return isLoggedIn ? <Navigate to="/contacts" replace /> : <>{children}</>;
}