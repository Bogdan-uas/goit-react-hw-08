import style from "./SearchBox.module.css";
import { useDispatch, useSelector } from "react-redux";
import { setFilter } from "../../redux/filters/slice.js";
import { selectFilter } from "../../redux/filters/selectors.js";

export default function SearchBox() {
    const dispatch = useDispatch();
    const filter = useSelector(selectFilter);

    const handleFilterChange = (e) => {
        dispatch(setFilter(e.target.value));
    };

    return (
        <div className={style.container}>
            <p className={style.label}>Find contacts by name</p>
            <input
                type="text"
                value={filter}
                onChange={handleFilterChange}
                className={style.input}
            />
        </div>
    );
}