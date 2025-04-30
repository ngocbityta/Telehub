import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import useAuth from "../../hooks/useAuth";
import useTheme from "../../hooks/useTheme";
import axios from "axios";
import TeamIntro from "../../components/TeamIntro";

function Login() {

    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');

    const [hasError, setHasError] = useState(false);
    const [message, setMessage] = useState('');

    const { setAuth, trusted, setTrusted } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const { theme } = useTheme();

    useEffect(() => {
        async function handleCallbackResponse(response) {
            const GoogleUserInfo = jwtDecode(response.credential);
            // console.log(GoogleUserInfo);
            try {
                const response = await axios.post('/api/auth/google', {
                    email: GoogleUserInfo.email,
                    name: GoogleUserInfo.name,
                    picture: GoogleUserInfo.picture
                });
                console.log(response.data);
                const username = response?.data?.username;
                const accessToken = response?.data?.accessToken;
                const fullname = response?.data?.fullname;
                const email = response?.data?.email;
                const streamToken = response?.data?.streamToken;
                const image = response?.data?.image;
                setAuth({ username, fullname, email, accessToken, streamToken, image });
                navigate('/', { replace: true });
            } catch (error) {
                console.log(error);
                alert('Unexpected error');
            }
        }

        const btnTheme = `${theme === 'dark' ? 'filled_blue' : 'outline'}`;
        /* global google */
        google.accounts.id.initialize({
            client_id:
                "118692739109-em2kp06md5s62ee8533ugpq3usq5e684.apps.googleusercontent.com",
            callback: handleCallbackResponse,
        });
        google.accounts.id.renderButton(
            document.getElementById('signInWithGoogle'),
            { theme: btnTheme, size: 'large', text: 'Sign in with Google' }
        );
    }, [navigate, setAuth, theme]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('/api/auth', { identifier, password });
            // console.log(response.data);
            const username = response?.data?.username;
            const accessToken = response?.data?.accessToken;
            const fullname = response?.data?.fullname;
            const email = response?.data?.email;
            const streamToken = response?.data?.streamToken;
            const image = response?.data?.image;
            setAuth({ username, fullname, email, accessToken, streamToken, image });
            setIdentifier('');
            setPassword('');
            setHasError(false);
            navigate(from, { replace: true });
        } catch (error) {
            setHasError(true);
            console.log(error);
            if (!error?.response) {
                setMessage('No server response');
            } else if (error.response?.status === 400) {
                setMessage(error.response.data);
            } else {
                setMessage('Internal server error');
            }
        }
    };

    useEffect(() => {
        localStorage.setItem("trusted", trusted);
    }, [trusted])

    const toggleTrusted = () => {
        setTrusted(prev => !prev);
    }

    return (
        <div className="h-screen w-screen flex bg-[var(--login-right-bg)]">
            {/* left theme */}
            <div className="h-full w-1/2 bg-gradient-to-r from-[--login-start-gradient] to-[--login-end-gradient] flex-auto">
                <TeamIntro inLoginPage />
            </div>
            {/* right theme */}
            <div className="h-full w-1/2 flex items-center justify-center">
                {/* Box */}
                <div className="w-80 h-100 rounded-lg border-2 border-[var(--login-border-color)] shadow-xl flex flex-col
                 bg-[var(--login-form-container)]" >

                    {/* Icon */}
                    <svg width={60} fill="rgba(19 123 205)" className="h-16 flex m-1 ml-5 mt-3 " viewBox="0 0 640 512"><path d="M88.2 309.1c9.8-18.3 6.8-40.8-7.5-55.8C59.4 230.9 48 204 48 176c0-63.5 63.8-128 160-128s160 64.5 160 128s-63.8 128-160 128c-13.1 0-25.8-1.3-37.8-3.6c-10.4-2-21.2-.6-30.7 4.2c-4.1 2.1-8.3 4.1-12.6 6c-16 7.2-32.9 13.5-49.9 18c2.8-4.6 5.4-9.1 7.9-13.6c1.1-1.9 2.2-3.9 3.2-5.9zM0 176c0 41.8 17.2 80.1 45.9 110.3c-.9 1.7-1.9 3.5-2.8 5.1c-10.3 18.4-22.3 36.5-36.6 52.1c-6.6 7-8.3 17.2-4.6 25.9C5.8 378.3 14.4 384 24 384c43 0 86.5-13.3 122.7-29.7c4.8-2.2 9.6-4.5 14.2-6.8c15.1 3 30.9 4.5 47.1 4.5c114.9 0 208-78.8 208-176S322.9 0 208 0S0 78.8 0 176zM432 480c16.2 0 31.9-1.6 47.1-4.5c4.6 2.3 9.4 4.6 14.2 6.8C529.5 498.7 573 512 616 512c9.6 0 18.2-5.7 22-14.5c3.8-8.8 2-19-4.6-25.9c-14.2-15.6-26.2-33.7-36.6-52.1c-.9-1.7-1.9-3.4-2.8-5.1C622.8 384.1 640 345.8 640 304c0-94.4-87.9-171.5-198.2-175.8c4.1 15.2 6.2 31.2 6.2 47.8l0 .6c87.2 6.7 144 67.5 144 127.4c0 28-11.4 54.9-32.7 77.2c-14.3 15-17.3 37.6-7.5 55.8c1.1 2 2.2 4 3.2 5.9c2.5 4.5 5.2 9 7.9 13.6c-17-4.5-33.9-10.7-49.9-18c-4.3-1.9-8.5-3.9-12.6-6c-9.5-4.8-20.3-6.2-30.7-4.2c-12.1 2.4-24.7 3.6-37.8 3.6c-61.7 0-110-26.5-136.8-62.3c-16 5.4-32.8 9.4-50 11.8C279 439.8 350 480 432 480z" /></svg>

                    {/* Title */}
                    <div className="ml-5 mt-1 text-sm text-[var(--login-text-color)]">
                        Welcome to Telehub, <br></br>
                        Login to your account.
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="mt-2" >
                        {/* Input */}
                        <div className="ml-5 mr-5 relative">
                            <label htmlFor="identifier" className="absolute px-1 font-semibold bg-[var(--login-form-container)]
                             left-3 z-20 text-blue-600 text-xs  " > Username or Email </label>
                            <input
                                type="text"
                                id="identifier"
                                className="outline-0 absolute top-2 z-10 rounded-sm py-1.5 pl-3 w-full bg-[var(--login-form-container)]
                                 text-[var(--login-input-text-color)] border-2 border-gray-300 duration-300 hover:border-cyan-600 focus:border-blue-700"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)} />
                        </div>

                        <div className="mt-14 ml-5 mr-5 relative">
                            <label htmlFor="password" className="absolute px-1 font-semibold bg-[var(--login-form-container)]
                            left-3 z-20 text-blue-600 text-xs  " > Password </label>
                            <input
                                type="password"
                                id="password"
                                className="outline-0 absolute top-2 z-10 rounded-sm py-1.5 pl-3 w-full bg-[var(--login-form-container)]
                                 text-[var(--login-input-text-color)] border-2 border-gray-300 duration-300 hover:border-cyan-600 focus:border-blue-700"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} />
                        </div>

                        {/* Submit */}
                        <div className="mt-28 ml-5 flex justify-between items-center mr-5">
                            <div className='flex justify-between items-center mt-[-20px]'>
                                <input type='checkbox' id='trusted' className="checkbox-primary checkbox w-4 h-4" onChange={toggleTrusted} checked={trusted}></input>
                                <label htmlFor='trusted' className="text-sm pl-1">Trust this device</label>
                            </div>
                            <button
                                type="submit"
                                className="inline-block w-16 h-10 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 duration-300"
                            >
                                Login
                            </button>
                        </div>

                        <div className="flex justify-end mt-2">
                            <span className={`flex-1 w-[100px] pl-5 ${hasError ? 'text-red-600' : 'text-green-600'}`}>{message}</span>
                            <Link to="/forgot" className="mr-4">
                                <div className='inline text-sm font-light text-gray-500 underline underline-offset-4'>
                                    Forgot password?
                                </div>
                            </Link>
                        </div>
                    </form>

                    <hr className="w-[90%] self-center border-gray-300 mt-5" />

                    {/* Register */}
                    <div className="pt-4 mt-1 px-3 flex items-center">
                        <div className=" text-md text-gray-500 font-normal">
                            No account?
                        </div>


                        <Link to="/register">
                            <button
                                type="submit"
                                className=" w-20 h-10 ml-2 bg-gray-500 text-white font-semibold rounded-md hover:bg-gray-600 duration-300"
                            >
                                Sign up
                            </button>
                        </Link>
                    </div>
                    <span className='self-center pt-2'>or</span>

                    {/* Google Login */}
                    <div className='flex justify-center items-center mt-2 mb-6 '>
                        <div id='signInWithGoogle'></div>
                    </div>

                </div>

            </div>

        </div>
    )
}

export default Login;