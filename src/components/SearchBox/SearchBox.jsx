import style from "./SearchBox.module.css";
import { useDispatch, useSelector } from "react-redux";
import { setFilter, setSearchBy } from "../../redux/filters/slice.js";
import { selectFilter, selectSearchBy } from "../../redux/filters/selectors.js";
import { selectIsEditingGlobal, selectIsModalOpen } from "../../redux/ui/selectors.js";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function SearchBox() {
    const dispatch = useDispatch();
    const filter = useSelector(selectFilter);
    const searchBy = useSelector(selectSearchBy);
    const isEditingGlobal = useSelector(selectIsEditingGlobal);
    const isModalOpen = useSelector(selectIsModalOpen);
    const isLocked = isEditingGlobal || isModalOpen;

    const [inputValue, setInputValue] = useState(filter);

    useEffect(() => {
        setInputValue(filter);
    }, [filter]);

    const handleFilterChange = (e) => {
        const value = e.target.value;
        setInputValue(value);

        if (isLocked) {
            toast.error("You can't search while editing or confirming an action!", {
                duration: 6000,
                style: { borderRadius: "10px", textAlign: "center" },
            });
            return;
        }

        if (searchBy === "number" && /[a-zA-Z]/.test(value)) {
            toast("Seems like you meant to search by name instead.", {
                icon: '❗',
                duration: 6000,
                style: { borderRadius: "10px", textAlign: "center" },
            });
            dispatch(setSearchBy("name"));
            return;
        }

        if (searchBy === "name" && /\d/.test(value)) {
            toast("Seems like you meant to search by number instead.", {
                icon: '❗',
                duration: 6000,
                style: { borderRadius: "10px", textAlign: "center" },
            });
            dispatch(setSearchBy("number"));
            return;
        }

        dispatch(setFilter(value));
    };

    const handleSearchByChange = (value) => {
        if (isLocked) {
            toast.error("You can't change search method while editing or confirming an action!", {
                duration: 6000,
                style: { borderRadius: "10px", textAlign: "center" },
            });
            return;
        }

        dispatch(setSearchBy(value));
        dispatch(setFilter(""));
        setInputValue("");
    };

    const handleInputWrapperClick = () => {
        if (isLocked) {
            toast.error("You can't search while editing or confirming an action!", {
                duration: 6000,
                style: { borderRadius: "10px", textAlign: "center" },
            });
        }
    };

    const handleRadioWrapperClick = (e, value) => {
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
                    />
                    <span className={style.span}>Find a contact by name</span>
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
                    />
                    <span className={style.span}>Find a contact by number</span>
                </div>
            </div>

            <div
                className={isLocked ? style.disabled : ""}
                onClick={handleInputWrapperClick}
            >
                <input
                    type="text"
                    placeholder={`Search by ${searchBy}`}
                    value={inputValue}
                    onChange={handleFilterChange}
                    className={style.input}
                    readOnly={isLocked}
                />
            </div>
        </div>
    );
}
