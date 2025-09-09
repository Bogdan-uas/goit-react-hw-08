import style from "./SortControl.module.css";
import { useState } from "react";
import type { AppDispatch } from '../../redux/store';
import { useSelector, useDispatch } from "react-redux";
import { selectContacts } from "../../redux/contacts/selectors";
import { setSortOrder } from "../../redux/filters/slice";
import { selectSortOrder } from "../../redux/filters/selectors";
import { selectIsEditingGlobal, selectIsModalOpen } from "../../redux/ui/selectors";
import { useTranslation } from "react-i18next";
import { useNotify } from "../../helpers/useNotify";

type SortOrder = "default" | "asc" | "desc";

export default function SortControl() {
    const { t } = useTranslation();
    const notify = useNotify();
    const contacts = useSelector(selectContacts);
    const sortOrder = useSelector(selectSortOrder);
    const dispatch = useDispatch<AppDispatch>();
    const isEditingGlobal = useSelector(selectIsEditingGlobal);
    const isModalOpen = useSelector(selectIsModalOpen);
    const isLocked = isEditingGlobal || isModalOpen;

    const [showOptions, setShowOptions] = useState<boolean>(false);

    const handleToggle = () => {
        if (isLocked) {
            notify.error(
                isModalOpen
                    ? t("contactsPage.sortControl.toastModalToggle")
                    : t("contactsPage.sortControl.toastEditingToggle"),
                {
                    duration: 4000,
                    style: { borderRadius: "10px", textAlign: "center" },
                }
            );
            return;
        }
        setShowOptions((prev) => !prev);
    };

    const handleSortChange = (order: SortOrder) => {
        if (isLocked) {
            notify.error(
                isModalOpen
                    ? t("contactsPage.sortControl.toastModalChange")
                    : t("contactsPage.sortControl.toastEditingChange"),
                {
                    duration: 4000,
                    style: { borderRadius: "10px", textAlign: "center" },
                }
            );
            return;
        }
        dispatch(setSortOrder(order));
    };

    if (contacts.length === 0) return null;

    const textFunction = (option1: React.ReactNode, option2: React.ReactNode) => {
        return showOptions ? option2 : option1;
    };

    return (
        <div className={style.container}>
            <button
                onClick={handleToggle}
                className={`${style.sort_button} ${isLocked ? style.disabled : ""}`}
            >
                {textFunction(
                    <p>{t("contactsPage.sortControl.promptShow")}</p>,
                    <p>{t("contactsPage.sortControl.promptHide")}</p>
                )}
            </button>
            {showOptions && (
                <p className={style.info_text}>
                    {t("contactsPage.sortControl.infoSave")}
                </p>
            )}

            {showOptions && (
                <div className={style.radio_group}>
                    <div
                        className={`${style.radio_label} ${style.no_sorting_radio} ${isLocked ? style.disabled : ""
                            }`}
                        onClick={() => handleSortChange("default")}
                    >
                        <input
                            type="radio"
                            value="default"
                            checked={sortOrder === "default"}
                            readOnly
                            className={isLocked ? style.disabled : ""}
                        />
                        <span className={`${style.span} ${isLocked ? style.disabled : ""}`}>
                            {t("contactsPage.sortControl.optionNone")}
                        </span>
                    </div>
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
                        <span className={`${style.span} ${isLocked ? style.disabled : ""}`}>
                            {t("contactsPage.sortControl.optionAsc")}
                        </span>
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
                        <span className={`${style.span} ${isLocked ? style.disabled : ""}`}>
                            {t("contactsPage.sortControl.optionDesc")}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}