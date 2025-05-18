import { useEffect, useState, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import useAuth from "../../hooks/useAuth";
import useTheme from "../../hooks/useTheme";
import axios from "axios";

function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [hasError, setHasError] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { setAuth, trusted, setTrusted } = useAuth();
  const { theme } = useTheme();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleGoogleLogin = useCallback(
    async (credential) => {
      try {
        const { email, name, picture } = jwtDecode(credential);
        const res = await axios.post("/api/auth/google", {
          email,
          name,
          picture,
        });

        const { username, fullname, accessToken, streamToken, image } =
          res.data;
        setAuth({ username, fullname, email, accessToken, streamToken, image });
        navigate("/", { replace: true });
      } catch (err) {
        console.error(err);
        setHasError(true);
        setMessage("Google login failed");
      }
    },
    [setAuth, navigate]
  );

  useEffect(() => {
    const btnTheme = theme === "dark" ? "filled_blue" : "outline";
    /* global google */
    google.accounts.id.initialize({
      client_id:
        "118692739109-em2kp06md5s62ee8533ugpq3usq5e684.apps.googleusercontent.com",
      callback: (res) => handleGoogleLogin(res.credential),
    });
    google.accounts.id.renderButton(
      document.getElementById("signInWithGoogle"),
      {
        theme: btnTheme,
        size: "large",
        text: "continue_with",
      }
    );
  }, [theme, handleGoogleLogin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/api/auth", { identifier, password });
      const { username, fullname, email, accessToken, streamToken, image } =
        res.data;
      setAuth({ username, fullname, email, accessToken, streamToken, image });
      navigate(from, { replace: true });
    } catch (err) {
      setHasError(true);
      if (!err?.response) setMessage("No server response");
      else if (err.response?.status === 400) setMessage(err.response.data);
      else setMessage("Login failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    localStorage.setItem("trusted", trusted);
  }, [trusted]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center px-4 py-6">
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl px-8 py-10 border border-gray-100">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-indigo-600">
            Welcome to Telehub
          </h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="identifier"
              className="block text-sm font-medium text-gray-700"
            >
              Username or Email
            </label>
            <input
              id="identifier"
              type="text"
              autoComplete="username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={trusted}
                onChange={() => setTrusted((prev) => !prev)}
                className="accent-indigo-600"
              />
              <span>Trust this device</span>
            </label>
            <Link
              to="/forgot"
              className="text-sm text-indigo-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-sm font-semibold py-2 px-4 rounded-md text-white transition ${
              loading
                ? "bg-indigo-300 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {message && (
            <p
              className={`text-sm mt-2 ${
                hasError ? "text-red-500" : "text-green-600"
              }`}
            >
              {message}
            </p>
          )}
        </form>

        <div className="flex items-center justify-center my-5">
          <span className="h-px w-full bg-gray-200" />
          <span className="px-3 text-sm text-gray-400">or</span>
          <span className="h-px w-full bg-gray-200" />
        </div>

        <div id="signInWithGoogle" className="flex justify-center" />

        <div className="mt-6 text-center text-sm">
          No account?
          <Link
            to="/register"
            className="ml-1 text-indigo-600 hover:underline font-medium"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
