import { useEffect, useState } from "react";
import axiosConfig from "../../utils/axios.config";
import { UserResponse } from "../../utils/types";

export const getProfile = (url: string, token: string) => {
    const [data, setData] = useState<UserResponse | null>(null);
    const [error, setError] = useState<Error | unknown>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axiosConfig.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setData(response.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        /*
        (async () => {
            try {
                setLoading(true);
                const response = await axiosConfig.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setData(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        })(); */
        if (!url || !token) return;

        fetchData();
    }, [url]);

    return { data, error, loading };
};
