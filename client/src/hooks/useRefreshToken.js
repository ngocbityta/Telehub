import axios from 'axios';
import useAuth from './useAuth';

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        const response = await axios.post('/api/auth/refreshToken', {
            withCredentials: true
        });
        // console.log(response);
        setAuth({
            username: response.data.username,
            image: response.data.image,
            fullname: response.data.fullname,
            email: response.data.email,
            accessToken: response.data.accessToken,  
            streamToken: response.data.streamToken,
            userId: response.data.userId
        });
        return response.data.accessToken;
    }
    return refresh;
};

export default useRefreshToken;