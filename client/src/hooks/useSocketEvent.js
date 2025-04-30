import { useEffect } from 'react';
import useSocket from './useSocket';

const useListenEvent = () => {
    const { socket, setInComingCall } = useSocket();

    useEffect(() => {
        socket?.on("someone_calling", (data) => {
            // console.log(data);
            setInComingCall(data);
        })

        return () => socket?.off("someone_calling"); // cleanup
    }, [socket, setInComingCall]);
}

export default useListenEvent;