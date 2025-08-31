import { useEffect } from "react";

interface PageTitleSetterProps {
    title: string;
}

export default function PageTitleSetter({ title }: PageTitleSetterProps): null {
    useEffect(() => {
        document.title = title;
    }, [title]);

    return null;
}