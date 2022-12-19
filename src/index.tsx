import * as React from 'react'
import {createRoot} from "react-dom/client";

const root = createRoot(document.getElementById("root")!);

const makeRandomString = () => (Math.random() + 1).toString(36).substring(2);

const setCookie = (name: string, value: string) => {
    document.cookie = `${name}=${value}; path=/`;
}

const simple = async () => {
    const response = await fetch("http://localhost:3000/api/simple/");
    alert(JSON.stringify(await response.json()) == '{"thisThing":"Works"}');
}

const serializingHeaders = async () => {
    const response = await fetch("http://localhost:3000/api/headers/", {headers: new Headers({"X-Some-Header": "Working"})});
    const {header} = await response.json();
    alert(header == "Working");
}

const responseHeaders = async () => {
    const response = await fetch("http://localhost:3000/api/simple/");
    alert(response.headers instanceof Headers);
}

const cookie = async () => {
    const toSet = makeRandomString();
    const response = await fetch(`http://localhost:3000/api/cookie/${toSet}/`);
    alert(document.cookie.includes(toSet));
}

const urlEncoded = async () => {
    const payload = {some: "value"}
    const response = await fetch(`http://localhost:3000/api/body/`, {method: "POST", headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          }, body: new URLSearchParams(payload)
    })

    alert(JSON.stringify(await response.json()) == '{"some":"value"}');
}

const multipartEncoded = async () => {
    const body = new FormData();
    body.append("doesthiswork", "itdoes");
    const response = await fetch(`http://localhost:3000/api/multipart/`, {method: "POST", body});

    const {result} = await response.json();
    alert(result == "itdoes");
}

const numberResponse = async () => {
    const response = await fetch(`http://localhost:3000/api/number/`);
    alert(await response.json() == 5);
}

const stringResponse = async () => {
    const response = await fetch(`http://localhost:3000/api/string/`);
    alert(await response.json() == "a string");
}

const nullResponse = async () => {
    const response = await fetch(`http://localhost:3000/api/null/`);
    alert(await response.json() == null);
}

const trueResponse = async () => {
    const response = await fetch(`http://localhost:3000/api/true/`);
    alert(await response.json() == true);
}

const falseResponse = async () => {
    const response = await fetch(`http://localhost:3000/api/false/`);
    alert(await response.json() == false);
}

const readCookie = async () => {
    const cookieName = makeRandomString();
    const cookieValue = makeRandomString();
    setCookie(cookieName, cookieValue);

    const response = await fetch(`http://localhost:3000/api/read-cookie/${cookieName}`);
    const {value} = await response.json();
    alert(value == cookieValue);
}

const readBlob = async () => {
    const response = await fetch("http://localhost:3000/api/blob/");
    const {size} = await response.blob();
    alert(size == 33788);
}

const badRequest = async () => {
    const response = await fetch("http://localhost:3000/api/400/");
    const {thisField} = await response.json();
    alert(response.status == 400 && thisField == "is required");
}

const networkError = async () => {
    try {
        const response = await fetch("https://nowaythisworks");
        alert(false);
    }
    catch (error: unknown) {
        alert(true);
    }
}

root.render(
    <div>
        <button onClick={simple}>Simple</button>
        <button onClick={serializingHeaders}>Headers in request</button>
        <button onClick={responseHeaders}>Response headers</button>
        <button onClick={cookie}>Cookie</button>
        <button onClick={urlEncoded}>URL Encoded</button>
        <button onClick={multipartEncoded}>Multipart Encoded</button>
        <button onClick={numberResponse}>Number response</button>
        <button onClick={stringResponse}>String response</button>
        <button onClick={nullResponse}>Null response</button>
        <button onClick={trueResponse}>True response</button>
        <button onClick={falseResponse}>False response</button>
        <button onClick={readCookie}>Read Cookie</button>
        <button onClick={readBlob}>Read Blob</button>
        <button onClick={badRequest}>Bad request</button>
        <button onClick={networkError}>Network error</button>
    </div>,
);
