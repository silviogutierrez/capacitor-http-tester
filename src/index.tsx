import * as React from 'react'
import {createRoot} from "react-dom/client";

const root = createRoot(document.getElementById("root")!);

const simple = async () => {
    const response = await fetch("http://localhost:3000/api/simple/");
    alert(JSON.stringify(await response.json(), null, 2));
}

const cookie = async () => {
    const response = await fetch("http://localhost:3000/api/cookie/");
    alert(JSON.stringify(await response.json(), null, 2));
    alert(document.cookie);
}

root.render(
    <div>
        <button onClick={simple}>Simple</button>
        <button onClick={cookie}>Cookie</button>
    </div>,
);
