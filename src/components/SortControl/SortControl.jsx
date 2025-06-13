import style from "./SortControl.module.css";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectContacts } from "../../redux/contacts/selectors";
import { setSortOrder } from "../../redux/filters/slice";
import { selectSortOrder } from "../../redux/filters/selectors";
import { selectIsEditingGlobal, selectIsModalOpen } from "../../redux/ui/selectors";
import toast from "react-hot-toast";

export default function SortControl() {
    const contacts = useSelector(selectContacts);
    const sortOrder = useSelector(selectSortOrder);
    const dispatch = useDispatch();
    const isEditingGlobal = useSelector(selectIsEditingGlobal);
    const isModalOpen = useSelector(selectIsModalOpen);
    const isLocked = isEditingGlobal || isModalOpen;

    const [showOptions, setShowOptions] = useState(false);

    const handleToggle = () => {
        if (isLocked) {
            toast.error(
                isModalOpen
                    ? "Close the current modal before pressing this button!"
                    : "You can't press this button while editing a contact!",
                {
                    duration: 4000,
                    style: { borderRadius: "10px", textAlign: "center" },
                }
            );
            return;
        }
        setShowOptions((prev) => !prev);
    };

    const handleSortChange = (order) => {
        if (isLocked) {
            toast.error(
                isModalOpen
                    ? "Close the current modal before choosing a sorting method!"
                    : "You can't sort the contacts while editing one!",
                {
                    duration: 4000,
                    style: { borderRadius: "10px", textAlign: "center" },
                }
            );
        }
        dispatch(setSortOrder(order));
    };

    if (contacts.length === 0) return null;

    const textFunction = (option1, option2) => {
        return showOptions ? option2 : option1;
    };

    return (
        <div className={style.container}>
            <button
                onClick={handleToggle}
                className={`${style.sort_button} ${isLocked ? style.disabled : ""}`}
            >
                {textFunction(
                    <p>Do you want to sort the contacts?</p>,
                    <p>If you don't want to sort already, click it again!</p>
                )}
            </button>
            {showOptions && (
                <p className={style.info_text}>(It will save your current sorting method!)</p>
            )}

            {showOptions && (
                <div className={style.radio_group}>
                    <div
                        className={`${style.radio_label} ${isLocked ? style.disabled : ""}`}
                        onClick={() => handleSortChange("asc")}
                    >
                        <input
                            type="radio"
                            value="asc"
                            checked={sortOrder === "asc"}
                            readOnly
                            className={isLocked ? style.disabled : ""}
                        />
                        <span className={`${style.span} ${isLocked ? style.disabled : ""}`}>A-Z</span>
                    </div>

                    <div
                        className={`${style.radio_label} ${isLocked ? style.disabled : ""}`}
                        onClick={() => handleSortChange("desc")}
                    >
                        <input
                            type="radio"
                            value="desc"
                            checked={sortOrder === "desc"}
                            readOnly
                            className={isLocked ? style.disabled : ""}
                        />
                        <span className={`${style.span} ${isLocked ? style.disabled : ""}`}>Z-A</span>
                    </div>
                </div>
            )}
        </div>
    );
}