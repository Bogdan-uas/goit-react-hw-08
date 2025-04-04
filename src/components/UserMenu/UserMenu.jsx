import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../../redux/auth/selectors";
import { apiLogout } from "../../redux/auth/operations";
import { CiLogout } from "react-icons/ci";
import css from "./UserMenu.module.css";

export default function UserMenu() {
const dispatch = useDispatch();

const onLogout = () => dispatch(apiLogout());
const user = useSelector(selectUser);

return (
    <div className={css.userMenu}>
    <p className={css.userdata}>Welcome, {user.name}!🗿</p>
    <button className={css.button} type="button" onClick={onLogout}>
        <CiLogout className={css.icon} />
    </button>
    </div>
);
};