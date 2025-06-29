import { createContext, useState, useEffect } from "react";
import useAuth from '../hooks/useAuth';
import io from "socket.io-client";

const SocketContext = createContext({});

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [inComingCall, setInComingCall] = useState(null);
    const { auth } = useAuth();

    useEffect(() => {
        if (auth?.username) {
            const newSocket = io("https://ec2-52-65-182-50.ap-southeast-2.compute.amazonaws.com", {
                query: {
                    username: auth.username,
                },
            });
            setSocket(newSocket);
            console.log(`Authenticated`);
        } else {
            console.error(`Not authenticated yet`);
        }
    }, [auth]);

    return (
        <SocketContext.Provider value={{ socket, setSocket, inComingCall, setInComingCall }}>
            {children}
        </SocketContext.Provider>
    )
}

export default SocketContext;