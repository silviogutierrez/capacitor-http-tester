import * as React from 'react'
import {createRoot} from "react-dom/client";

const root = createRoot(document.getElementById("root")!);

const testing = async () => {
    const response = await fetch("https://www.joyapp.com/api/credentials/");
    alert(JSON.stringify(await response.json(), null, 2));
}

root.render(
    <div>
        <button onClick={testing}>
            Click me
        </button>
    </div>,
);
