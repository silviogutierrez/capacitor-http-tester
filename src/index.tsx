import * as React from "react";
import {createRoot} from "react-dom/client";
import {Capacitor} from "@capacitor/core";

declare global {
    interface Window {
        cordova?: unknown;
    }
}

const BASE_URL =
    Capacitor.getPlatform() == "android"
        ? "http://10.0.2.2:3000"
        : "http://localhost:3000";

const root = createRoot(document.getElementById("root")!);

const makeRandomString = () => (Math.random() + 1).toString(36).substring(2);

const setCookie = (name: string, value: string) => {
    document.cookie = `${name}=${value}; path=/`;
};

const simple = async () => {
    const response = await fetch(`${BASE_URL}/api/simple/`);
    return JSON.stringify(await response.json()) == '{"thisThing":"Works"}';
};

const requestObject = async () => {
    const request = new Request(`${BASE_URL}/api/simple/`);
    const response = await fetch(request);
    return JSON.stringify(await response.json()) == '{"thisThing":"Works"}';
};
requestObject.issue = "6174";

const serializingHeaders = async () => {
    const response = await fetch(`${BASE_URL}/api/headers/`, {
        headers: new Headers({"X-Some-Header": "Working"}),
    });
    const {header} = await response.json();
    return header == "Working";
};
serializingHeaders.issue = "5945";

const responseHeaders = async () => {
    const response = await fetch(`${BASE_URL}/api/simple/`);
    return response.headers instanceof Headers;
};

const cookie = async () => {
    const name = makeRandomString();
    const value = makeRandomString();
    const response = await fetch(`${BASE_URL}/api/cookie/${name}/${value}/`);
    return document.cookie.includes(value);
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
urlEncoded.issue = "6165";

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
multipartEncoded.issue = "6142";

const readText = async () => {
    const response = await fetch(`${BASE_URL}/api/text/`);
    return (
        (await response.text()) ==
        '"I am text, content type should not take precendece over calling response.text()"'
    );
};
readText.issue = "6184";

const numberResponse = async () => {
    const response = await fetch(`${BASE_URL}/api/number/`);
    return (await response.json()) == 5;
};
numberResponse.issue = "6170";

const stringResponse = async () => {
    const response = await fetch(`${BASE_URL}/api/string/`);
    return (await response.json()) == "a string";
};
stringResponse.issue = "6170";

const nullResponse = async () => {
    const response = await fetch(`${BASE_URL}/api/null/`);
    return (await response.json()) == null;
};
nullResponse.issue = "6170";

const trueResponse = async () => {
    const response = await fetch(`${BASE_URL}/api/true/`);
    return (await response.json()) == true;
};
trueResponse.issue = "6170";

const falseResponse = async () => {
    const response = await fetch(`${BASE_URL}/api/false/`);
    return (await response.json()) == false;
};
falseResponse.issue = "6170";

const readCookieSetOnClient = async () => {
    const cookieName = makeRandomString();
    const cookieValue = makeRandomString();
    setCookie(cookieName, cookieValue);

    const response = await fetch(`${BASE_URL}/api/read-cookie/${cookieName}`);
    const data = await response.json();
    const {value} = data;
    return value == cookieValue;
};

const deleteServerSetCookie = async () => {
    const cookieName = makeRandomString();
    const cookieValue = makeRandomString();

    await fetch(`${BASE_URL}/api/cookie/${cookieName}/${cookieValue}`);
    document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
    const response = await fetch(`${BASE_URL}/api/read-cookie/${cookieName}`);
    const {value} = await response.json();
    return value == null;
};

const readBlob = async () => {
    const response = await fetch(`${BASE_URL}/api/blob/`);
    const {size} = await response.blob();
    return size == 33788;
};
readBlob.issue = "6126";

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

interface TestCase {
    (): Promise<boolean>;
    issue?: string;
}

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
            <h3 style={{marginTop: 0, marginBottom: 0}}>
                {props.name}{" "}
                {props.test.issue != null && (
                    <a
                        href={`https://github.com/ionic-team/capacitor/issues/${props.test.issue}/`}
                    >
                        #{props.test.issue}
                    </a>
                )}
            </h3>
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
                requestObject,
                serializingHeaders,
                responseHeaders,
                cookie,
                urlEncoded,
                multipartEncoded,
                readText,
                numberResponse,
                stringResponse,
                nullResponse,
                trueResponse,
                falseResponse,
                readCookieSetOnClient,
                deleteServerSetCookie,
                readBlob,
                badRequest,
                networkError,
            }}
        />
    </div>,
);
