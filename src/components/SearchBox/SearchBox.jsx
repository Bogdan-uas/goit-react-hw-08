import style from "./SearchBox.module.css";
import { useDispatch, useSelector } from "react-redux";
import { setFilter } from "../../redux/filtersSlice.js";
import { selectNameFilter } from "../../redux/filtersSlice.js";

export default function SearchBox() {
    const dispatch = useDispatch();
    const filter = useSelector(selectNameFilter);

    const handleFilterChange = (evt) => {
        dispatch(setFilter(evt.target.value));
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