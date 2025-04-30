import axios from 'axios';
import useAuth from "./useAuth";
import useSocket from "./useSocket";

const useLogout = () => {
    const { setAuth, setLogoutConfirm } = useAuth();
    const { socket, setSocket } = useSocket();
    const logout = async () => {
        setAuth({});
        setLogoutConfirm(true);
        if (socket) {
            console.log("Closing socket");
            await socket.close();
            setSocket(null);
        }
        try {
            await axios('/api/auth/logout', {
                withCredentials: true
            });
        } catch (err) {
            console.error(err);
        }
    }

    return logout;
}

export default useLogout