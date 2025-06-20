import { NavLink } from "react-router-dom";
import css from "./Navigation.module.css";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../../redux/auth/selectors";

export default function Navigation(): React.ReactElement {
const isLoggedIn = useSelector(selectIsLoggedIn);

return (
    <div>
    <nav className={css.nav}>
        <NavLink className={css.link} to="/">
            Home
        </NavLink>
        {isLoggedIn && (
        <NavLink className={css.link} to="/contacts">
            Contacts
        </NavLink>
        )}
    </nav>
    </div>
);
}