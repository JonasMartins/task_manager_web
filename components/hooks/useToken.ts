import { useState } from "react";
import { cookie_name } from "../../utils/consts";
import { useCookies } from "react-cookie";

export const useToken = () => {
    const [cookies, setCookie] = useCookies([cookie_name]);

    const [token, setTokenInternal] = useState(() => {
        if (typeof window !== "undefined") {
            return cookies[cookie_name];
        } else {
            return "";
        }
    });

    const setToken = (newToken: string): void => {
        setCookie(cookie_name, newToken, {
            path: "/",
        });
        setTokenInternal(newToken);
    };

    return [token, setToken] as const;
};
