import React from "react";
import { createStore } from "reusable";


export const useModes = createStore(() => {
    const [editing, setEditing] = React.useState(false);

    return {
        editing,
        setEditing,
    }
})