import style from "./SearchBox.module.css";
import { useDispatch, useSelector } from "react-redux";
import { setFilter, setSearchBy } from "../../redux/filters/slice";
import { selectFilter, selectSearchBy } from "../../redux/filters/selectors";
import { selectIsEditingGlobal, selectIsModalOpen } from "../../redux/ui/selectors";
import { useState, useEffect, ChangeEvent, MouseEvent } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export default function SearchBox() {
    const dispatch = useDispatch();
    const filter = useSelector(selectFilter);
    const searchBy = useSelector(selectSearchBy);
    const isEditingGlobal = useSelector(selectIsEditingGlobal);
    const isModalOpen = useSelector(selectIsModalOpen);
    const isLocked = isEditingGlobal || isModalOpen;

    const { t } = useTranslation();
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
                    ? t("contactsPage.searchBox.toastModalSearch")
                    : t("contactsPage.searchBox.toastEditingSearch"),
                {
                    duration: 4000,
                    style: { borderRadius: "10px", textAlign: "center" },
                }
            );
            return;
        }

        if (searchBy === "number" && /[a-zA-Z]/.test(value)) {
            toast(t("contactsPage.searchBox.toastSuggestName"), {
                icon: "❗",
                duration: 6000,
                style: { borderRadius: "10px", textAlign: "center" },
            });
            dispatch(setSearchBy("name"));
            return;
        }

        if (searchBy === "name" && /\d/.test(value)) {
            toast(t("contactsPage.searchBox.toastSuggestNumber"), {
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
                    ? t("contactsPage.searchBox.toastModalSwitch")
                    : t("contactsPage.searchBox.toastEditingSwitch"),
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
                    ? t("contactsPage.searchBox.toastModalSearch")
                    : t("contactsPage.searchBox.toastEditingSearch"),
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
                        {t("contactsPage.searchBox.searchByName")}
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
                        {t("contactsPage.searchBox.searchByNumber")}
                    </span>
                </div>
            </div>

            <div className={isLocked ? style.disabled : ""} onClick={handleInputWrapperClick}>
                <input
                    type="text"
                    placeholder={
                        searchBy === "name"
                            ? t("contactsPage.searchBox.placeholderByName")
                            : t("contactsPage.searchBox.placeholderByNumber")
                    }
                    value={inputValue}
                    onChange={handleFilterChange}
                    className={`${style.input} ${isLocked ? style.disabled : ""}`}
                    readOnly={isLocked}
                />
            </div>
        </div>
    );
}