import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Tippy from "@tippyjs/react";
import useAuth from "../../hooks/useAuth";

const USERNAME_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%_?]).{6,24}$/;
const EMAIL_REGEX = /^([^\s@]+@[^\s@]+\.[^\s@]+)$/;

function UsernameTooltip({ status, hasText }) {
  return `Username must contain 4 to 24 characters and start with a letter ${
    hasText === "" ? "" : status ? "✅" : "❌"
  }`;
}
function PasswordTooltip({ status, hasText }) {
  return `Password must contain 6 to 24 characters, must include uppercase and lowercase letters, a number, a special character ${
    hasText === "" ? "" : status ? "✅" : "❌"
  }`;
}
function EmailTooltip({ status, hasText }) {
  return `Must be a valid email address ${
    hasText === "" ? "" : status ? "✅" : "❌"
  }`;
}
function PasswordCfTooltip({ status, hasText }) {
  return `Make sure your confirm password matches the one entered above ${
    hasText === "" ? "" : status ? "✅" : "❌"
  }`;
}

function Register() {
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [validName, setValidName] = useState(false);

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);

  const [password, setPassword] = useState("");
  const [validPwd, setValidPwd] = useState(false);

  const [cfPassword, setCfPassword] = useState("");
  const [validMatch, setValidMatch] = useState(false);

  const [hasError, setHasError] = useState(false);
  const [message, setMessage] = useState("");

  const [tmpAuth, setTmpAuth] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setValidName(USERNAME_REGEX.test(username));
  }, [username]);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(password));
    setValidMatch(password === cfPassword);
  }, [password, cfPassword]);

  const toHomePage = async () => {
    setAuth(tmpAuth);
    navigate("/", { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validName || !validEmail || !validPwd || !validMatch) {
      setHasError(true);
      setMessage("Please check your input fields.");
      return;
    }

    try {
      const response = await axios.post("/api/auth/register", {
        username,
        password,
        email,
      });
      const { accessToken, streamToken, image } = response.data;
      setUsername("");
      setEmail("");
      setPassword("");
      setCfPassword("");
      setHasError(false);
      setTmpAuth({ username, email, accessToken, streamToken, image });
      setSuccess(true);
    } catch (error) {
      setHasError(true);
      if (!error?.response) setMessage("No server response");
      else if (error.response?.status === 409)
        setMessage(
          error.response.data.taken === 1 ? "Email taken" : "Username taken"
        );
      else setMessage("Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl px-8 py-10 border border-gray-100">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-emerald-600">
            Create your account
          </h2>
          <p className="text-sm text-gray-500">Welcome to Telehub</p>
        </div>
  
        {!success ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <Tippy
              content={<UsernameTooltip status={validName} hasText={username} />}
              placement="right"
              trigger="focus"
            >
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Tippy>
  
            <Tippy
              content={<EmailTooltip status={validEmail} hasText={email} />}
              placement="right"
              trigger="focus"
            >
              <input
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Tippy>
  
            <Tippy
              content={<PasswordTooltip status={validPwd} hasText={password} />}
              placement="right"
              trigger="focus"
            >
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Tippy>
  
            <Tippy
              content={
                <PasswordCfTooltip status={validMatch} hasText={cfPassword} />
              }
              placement="right"
              trigger="focus"
            >
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                placeholder="Confirm Password"
                value={cfPassword}
                onChange={(e) => setCfPassword(e.target.value)}
              />
            </Tippy>
  
            {message && (
              <div
                className={`text-sm ${
                  hasError ? "text-red-500" : "text-green-600"
                }`}
              >
                {message}
              </div>
            )}
  
            <button
              type="submit"
              className="w-full py-2 bg-emerald-600 text-white text-sm font-semibold rounded-md hover:bg-emerald-700 transition duration-300"
            >
              Sign Up
            </button>
  
            <div className="text-sm text-center text-gray-500">
              Already have an account?
              <Link to="/login" className="ml-2 text-emerald-600 hover:underline font-medium">
                Login
              </Link>
            </div>
          </form>
        ) : (
          <div className="text-center">
            <h3 className="text-xl font-semibold text-green-600 mb-2">
              Registration Successful!
            </h3>
            <button
              onClick={toHomePage}
              className="mt-4 px-6 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition"
            >
              Go to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );  
}

export default Register;
