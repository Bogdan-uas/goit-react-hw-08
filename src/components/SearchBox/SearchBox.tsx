import style from "./SearchBox.module.css";
import { useDispatch, useSelector } from "react-redux";
import { setFilter, setSearchBy } from "../../redux/filters/slice";
import { selectFilter, selectSearchBy } from "../../redux/filters/selectors";
import { selectIsEditingGlobal, selectIsModalOpen } from "../../redux/ui/selectors";
import { useState, useEffect, ChangeEvent, MouseEvent } from "react";
import toast from "react-hot-toast";

export default function SearchBox() {
const dispatch = useDispatch();
const filter = useSelector(selectFilter);
const searchBy = useSelector(selectSearchBy);
const isEditingGlobal = useSelector(selectIsEditingGlobal);
const isModalOpen = useSelector(selectIsModalOpen);
const isLocked = isEditingGlobal || isModalOpen;

const [inputValue, setInputValue] = useState<string>(filter);

useEffect(() => {
    setInputValue(filter);
}, [filter]);

const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (isLocked) {
    toast.error(
        isModalOpen
            ? "Close the current modal before searching!"
            : "You can't search some other contacts while editing one!",
        {
            duration: 4000,
            style: { borderRadius: "10px", textAlign: "center" },
        }
    );
    return;
    }

    if (searchBy === "number" && /[a-zA-Z]/.test(value)) {
    toast("Seems like you meant to search by name instead.", {
        icon: "❗",
        duration: 6000,
        style: { borderRadius: "10px", textAlign: "center" },
    });
    dispatch(setSearchBy("name"));
    return;
    }

    if (searchBy === "name" && /\d/.test(value)) {
    toast("Seems like you meant to search by number instead.", {
        icon: "❗",
        duration: 6000,
        style: { borderRadius: "10px", textAlign: "center" },
    });
    dispatch(setSearchBy("number"));
    return;
    }

    dispatch(setFilter(value));
};

const handleSearchByChange = (value: "name" | "number") => {
    if (isLocked) {
    toast.error(
        isModalOpen
            ? "Close the current modal before changing search mode!"
            : "You can't change search method while editing a contact!",
        {
            duration: 4000,
            style: { borderRadius: "10px", textAlign: "center" },
        }
    );
    return;
    }

    dispatch(setSearchBy(value));
    dispatch(setFilter(""));
    setInputValue("");
};

const handleInputWrapperClick = () => {
    if (isLocked) {
    toast.error(
        isModalOpen
            ? "Close the current modal before searching!"
            : "You can't search some other contacts while editing one!",
        {
            duration: 4000,
            style: { borderRadius: "10px", textAlign: "center" },
        }
    );
    }
};

const handleRadioWrapperClick = (e: MouseEvent<HTMLDivElement>, value: "name" | "number") => {
    e.preventDefault();
    handleSearchByChange(value);
};

return (
    <div className={style.container}>
    <div className={style.radio_group}>
        <div
            className={`${style.radio_label} ${isLocked ? style.disabled : ""}`}
            onClick={(e) => handleRadioWrapperClick(e, "name")}
        >
        <input
            type="radio"
            value="name"
            checked={searchBy === "name"}
            readOnly
            className={isLocked ? style.disabled : ""}
        />
        <span className={`${style.span} ${isLocked ? style.disabled : ""}`}>
            Find a contact by name
        </span>
        </div>

        <div
            className={`${style.radio_label} ${isLocked ? style.disabled : ""}`}
            onClick={(e) => handleRadioWrapperClick(e, "number")}
        >
        <input
            type="radio"
            value="number"
            checked={searchBy === "number"}
            readOnly
            className={isLocked ? style.disabled : ""}
        />
        <span className={`${style.span} ${isLocked ? style.disabled : ""}`}>
            Find a contact by number
        </span>
        </div>
    </div>

    <div className={isLocked ? style.disabled : ""} onClick={handleInputWrapperClick}>
        <input
            type="text"
            placeholder={`Search by ${searchBy}`}
            value={inputValue}
            onChange={handleFilterChange}
            className={`${style.input} ${isLocked ? style.disabled : ""}`}
            readOnly={isLocked}
        />
    </div>
    </div>
);
}