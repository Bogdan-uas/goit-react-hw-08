import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectIsLoggedIn } from "../../redux/auth/selectors";

interface PrivateRouteProps {
    children: ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
const isLoggedIn = useSelector(selectIsLoggedIn);

    return isLoggedIn ? <>{children}</> : <Navigate to="/login" replace />;
}