import { useDispatch, useSelector } from "react-redux";
import { toggleDarkMode } from "../../redux/ui/themeSlice";
import {
    selectDarkMode,
    selectIsModalOpen,
    selectIsEditingGlobal,
} from "../../redux/ui/selectors";
import { LuSun } from "react-icons/lu";
import { IoMdMoon } from "react-icons/io";
import { useEffect, ChangeEvent } from "react";
import toast from "react-hot-toast";
import css from "./ThemeToggle.module.css";

export default function ThemeToggle() {
const dispatch = useDispatch();
const darkMode = useSelector(selectDarkMode);
const isModalOpen = useSelector(selectIsModalOpen);
const isEditingGlobal = useSelector(selectIsEditingGlobal);
const isLocked = isModalOpen || isEditingGlobal;

useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
}, [darkMode]);

const handleToggle = () => {
    dispatch(toggleDarkMode());
};

const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (isLocked) {
    e.preventDefault();
    toast.error(
        isModalOpen
            ? "Close the current modal before changing the theme!"
            : "You can't change the theme while editing!",
        {
            duration: 4000,
            style: { borderRadius: "10px", textAlign: "center" },
        }
    );
    } else {
        handleToggle();
    }
};

return (
    <div className={css.main_container}>
    <p className={css.info_text}>You can also change your theme!</p>
    <div className={`${css.display} ${isLocked ? css.disabled : ""}`}>
        <input
            className={css.input}
            type="checkbox"
            id="toggle"
            checked={darkMode}
            onChange={handleChange}
        />
        <label className={css.label} htmlFor="toggle">
        <div className={css.circle}>
            <LuSun className={css.sun} />
            <IoMdMoon className={css.moon} />
        </div>
        </label>
    </div>
    </div>
);
}