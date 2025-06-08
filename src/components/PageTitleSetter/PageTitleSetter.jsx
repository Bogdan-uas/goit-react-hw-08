import { useEffect } from "react";

const PageTitleSetter = ({ title }) => {
    useEffect(() => {
        document.title = title;
    }, [title]);
    return null;
};

export default PageTitleSetter;