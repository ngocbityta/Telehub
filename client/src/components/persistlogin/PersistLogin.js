import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import useRefreshToken from "../../hooks/useRefreshToken";
import useAuth from "../../hooks/useAuth";
import Loading from "../Loading";

const PersistLogin = () => {
    const [isLoading, setIsloading] = useState(true);
    const refresh = useRefreshToken();
    const { auth, trusted, logoutConfirm } = useAuth();

    useEffect(() => {
        const verifyRefreshToken = async () => {
            try {
                await refresh();
            } catch (error) {
                console.log(error);
            }
            finally {
                setIsloading(false);
            }
        }

        if (!auth?.accessToken) {
            // console.log("Persisting login");
            if (!logoutConfirm)
                verifyRefreshToken();
            else
                setIsloading(false);
        }
        else
            setIsloading(false);

    }, [auth, refresh, logoutConfirm]);

    return (
        <>
            {/* useEffect execute after first render
            so if the device is not trusted => go straight to Authenticate component,
            if refresh => clear auth => authenticate fail => navigate back to login */}
            {!trusted ? <Outlet></Outlet>
                : isLoading ? <Loading />
                    : <Outlet></Outlet>
            }
        </>
    )
}

export default PersistLogin