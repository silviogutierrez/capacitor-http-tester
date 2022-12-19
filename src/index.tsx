import * as React from "react";
import {createRoot} from "react-dom/client";
import {Capacitor} from "@capacitor/core";

declare global {
    interface Window {
        cordova?: unknown;
    }
}

const BASE_URL = Capacitor.getPlatform() == "android" ? "http://10.0.2.2:3000" : "http://localhost:3000";

const root = createRoot(document.getElementById("root")!);

const makeRandomString = () => (Math.random() + 1).toString(36).substring(2);

const setCookie = (name: string, value: string) => {
    document.cookie = `${name}=${value}; path=/`;
};

const simple = async () => {
    const response = await fetch(`${BASE_URL}/api/simple/`);
    return JSON.stringify(await response.json()) == '{"thisThing":"Works"}';
};

const serializingHeaders = async () => {
    const response = await fetch(`${BASE_URL}/api/headers/`, {
        headers: new Headers({"X-Some-Header": "Working"}),
    });
    const {header} = await response.json();
    return header == "Working";
};

const responseHeaders = async () => {
    const response = await fetch(`${BASE_URL}/api/simple/`);
    return response.headers instanceof Headers;
};

const cookie = async () => {
    const toSet = makeRandomString();
    const response = await fetch(`${BASE_URL}/api/cookie/${toSet}/`);
    return document.cookie.includes(toSet);
};

const urlEncoded = async () => {
    const payload = {some: "value"};
    const response = await fetch(`${BASE_URL}/api/body/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(payload),
    });

    return JSON.stringify(await response.json()) == '{"some":"value"}';
};

const multipartEncoded = async () => {
    const body = new FormData();
    body.append("doesthiswork", "itdoes");
    const response = await fetch(`${BASE_URL}/api/multipart/`, {
        method: "POST",
        body,
    });

    const {result} = await response.json();
    return result == "itdoes";
};

const numberResponse = async () => {
    const response = await fetch(`${BASE_URL}/api/number/`);
    return (await response.json()) == 5;
};

const stringResponse = async () => {
    const response = await fetch(`${BASE_URL}/api/string/`);
    return (await response.json()) == "a string";
};

const nullResponse = async () => {
    const response = await fetch(`${BASE_URL}/api/null/`);
    return (await response.json()) == null;
};

const trueResponse = async () => {
    const response = await fetch(`${BASE_URL}/api/true/`);
    return (await response.json()) == true;
};

const falseResponse = async () => {
    const response = await fetch(`${BASE_URL}/api/false/`);
    return (await response.json()) == false;
};

const readCookie = async () => {
    const cookieName = makeRandomString();
    const cookieValue = makeRandomString();
    setCookie(cookieName, cookieValue);

    const response = await fetch(`${BASE_URL}/api/read-cookie/${cookieName}`);
    const {value} = await response.json();
    return value == cookieValue;
};

const readBlob = async () => {
    const response = await fetch(`${BASE_URL}/api/blob/`);
    const {size} = await response.blob();
    return size == 33788;
};

const badRequest = async () => {
    const response = await fetch(`${BASE_URL}/api/400/`);
    const {thisField} = await response.json();
    return response.status == 400 && thisField == "is required";
};

const networkError = async () => {
    try {
        const response = await fetch("https://nowaythisworks");
        return false;
    } catch (error: unknown) {
        return true;
    }
};

type TestCase = () => Promise<boolean>;

const Test = (props: {name: string; test: TestCase}) => {
    const [passed, setPassed] = React.useState(false);

    React.useEffect(() => {
        props
            .test()
            .then((passed) => {
                setPassed(passed);
            })
            .catch(() => setPassed(false));
    }, []);

    return (
        <div style={{lineHeight: 1}}>
            <h3 style={{marginTop: 0, marginBottom: 0}}>{props.name}</h3>
            {passed == true && (
                <h5 style={{marginTop: 0, marginBottom: 0, color: "green"}}>Passed</h5>
            )}
            {passed == false && (
                <h5 style={{marginTop: 0, marginBottom: 0, color: "red"}}>Failed</h5>
            )}
        </div>
    );
};

const Tests = (props: {tests: Record<string, TestCase>}) => {
    return (
        <div>
            {Object.entries(props.tests).map(([name, test]) => {
                return <Test key={name} name={name} test={test} />;
            })}
        </div>
    );
};

root.render(
    <div>
        <Tests
            tests={{
                simple,
                serializingHeaders,
                responseHeaders,
                cookie,
                urlEncoded,
                multipartEncoded,
                numberResponse,
                stringResponse,
                nullResponse,
                trueResponse,
                falseResponse,
                readCookie,
                readBlob,
                badRequest,
                networkError,
            }}
        />
    </div>,
);
