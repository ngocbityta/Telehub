import { CallingState, StreamCall, StreamVideo, StreamVideoClient, useCallStateHooks, StreamTheme, SpeakerLayout, CallControls } from '@stream-io/video-react-sdk';
import { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import Loading from '../Loading';
import { useParams } from 'react-router-dom';

export default function Call() {

    const [client, setClient] = useState(null);
    const [call, setCall] = useState(null);
    const [error, setError] = useState(null);
    const { auth } = useAuth();
    const { username, streamToken } = auth;
    const { callType, callId } = useParams();

    useEffect(() => {

        // console.log(callId);

        const apiKey = 'e9j52x7tg6cw';
        const token = streamToken;
        const userId = username;

        // set up the user object
        const user = {
            id: userId,
            name: username,
            image: `${auth.image || `https://getstream.io/random_svg/?id=oliver&name=${username}`}`,
        };

        const videoClient = new StreamVideoClient({ apiKey, user, token });
        setClient(videoClient);

        const videoCall = videoClient.call('default', callId);

        videoCall.join({ create: true })
            .then(() => {
                setCall(videoCall);
            })
            .catch(error => {
                setError(error);
            });

        return () => {
            videoClient.disconnectUser();
            setClient(null);
            if (videoCall) {
                videoCall.leave();
                // videoCall.endCall();
                setCall(null);
            }
        };
    }, [streamToken, username, callId, auth.image]);

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (!call || !client) {
        return <div className='w-full'>
            <Loading />
        </div>
    }

    return (
        <StreamVideo client={client}>
            <StreamCall call={call}>
                <MyUILayout callType={callType} />
            </StreamCall>
        </StreamVideo>
    );
}

export const MyUILayout = ({ callType }) => {
    const {
        useCallCallingState,
        useCameraState,
        useMicrophoneState
    } = useCallStateHooks();

    const cameraState = useCameraState();
    const micState = useMicrophoneState();

    const callingState = useCallCallingState();

    if (callingState !== CallingState.JOINED) {
        return <></>
    }

    if (callType === 'audio') {
        cameraState.camera.disable();
    }

    if (!cameraState.hasBrowserPermission || !micState.hasBrowserPermission) {
        console.warn("Camera or microphone permissions are not granted.");

        return <div>Please grant camera and microphone permissions to continue.</div>;
    }

    return (
        <StreamTheme>
            <SpeakerLayout participantsBarPosition='bottom' />
            <CallControls />
        </StreamTheme>
    );
};