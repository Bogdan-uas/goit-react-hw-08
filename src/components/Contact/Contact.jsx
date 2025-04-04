import style from "./Contact.module.css";
import { BsPersonFill, BsTelephoneFill } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { deleteContact } from "../../redux/contacts/operations.js";

export default function Contact({ contact }) {
    const dispatch = useDispatch();

    const onUserDelete = (id) => {
        dispatch(deleteContact(id));
    };

    return (
        <div className={style.container}>
            <div className={style.info_container}>
                <BsPersonFill className={style.svg} size={18} />
                <p className={style.info_text}>{contact.name}</p>
            </div>
            <div className={style.info_container}>
                <BsTelephoneFill className={style.svg} size={16} />
                <p className={style.info_text}>{contact.number}</p>
            </div>
            <button className={style.delete_button} onClick={() => onUserDelete(user.id)}>
                Delete
            </button>
        </div>
    );
}