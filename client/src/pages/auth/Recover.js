import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Tippy from "@tippyjs/react";
import TeamIntro from "../../components/TeamIntro";

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%_?]).{6,24}$/;

const PasswordTooltip = ({ status, hasText }) => (
  <span>
    Password must contain 6 to 24 characters, include uppercase, lowercase,
    number, special char {hasText === "" ? "" : status ? "✅" : "❌"}
  </span>
);

const PasswordCfTooltip = ({ status, hasText }) => (
  <span>
    Confirm password must match above{" "}
    {hasText === "" ? "" : status ? "✅" : "❌"}
  </span>
);

function Recover() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");

  const [user, setUser] = useState(null);

  const [password, setPassword] = useState("");
  const [validPwd, setValidPwd] = useState(false);

  const [cfPassword, setCfPassword] = useState("");
  const [validMatch, setValidMatch] = useState(false);

  const [hasError, setHasError] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [setSuccess] = useState(false);

  // Verify token and get user info on mount
  useEffect(() => {
    if (!token) {
      navigate("/404", { replace: true });
      return;
    }
    axios
      .post("/api/auth/verify", { token })
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => {
        navigate("/404", { replace: true });
      });
  }, [navigate, token]);

  // Validate password and confirm password
  useEffect(() => {
    setValidPwd(PWD_REGEX.test(password));
    setValidMatch(password === cfPassword && cfPassword.length > 0);
  }, [password, cfPassword]);

  const handleSubmit = async () => {
    if (!validPwd) {
      setHasError(true);
      setMessage("Password is not valid.");
      return;
    }
    if (!validMatch) {
      setHasError(true);
      setMessage("Confirm password does not match.");
      return;
    }

    setLoading(true);
    setHasError(false);
    setMessage("");

    try {
      await axios.post("/api/auth/recover", {
        username: user.username,
        password,
      });
      setSuccess(true);
      setMessage("Recovery successful. Please proceed to login.");
      setPassword("");
      setCfPassword("");
    } catch (error) {
      setHasError(true);
      setMessage(error.response?.data?.message || "Internal Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex bg-[var(--login-right-bg)]">
      {/* Left side intro */}
      <div className="w-1/2 bg-gradient-to-r from-[--login-start-gradient] to-[--login-end-gradient] flex items-center justify-center">
        <TeamIntro />
      </div>

      {/* Right side form */}
      <div className="w-1/2 flex items-center justify-center">
        <div
          className="rounded-lg max-w-[340px] p-5 border-2 border-[var(--login-border-color)] shadow-xl
          flex flex-col bg-[var(--login-form-container)] relative"
        >
          {/* Icon */}
          <svg
            width={60}
            fill="rgba(19 123 205)"
            className="h-16 mb-4"
            viewBox="0 0 640 512"
            aria-hidden="true"
          >
            <path d="M88.2 309.1c9.8-18.3 6.8-40.8-7.5-55.8C59.4 230.9 48 204 48 176c0-63.5 63.8-128 160-128s160 64.5 160 128s-63.8 128-160 128c-13.1 0-25.8-1.3-37.8-3.6c-10.4-2-21.2-.6-30.7 4.2c-4.1 2.1-8.3 4.1-12.6 6c-16 7.2-32.9 13.5-49.9 18c2.8-4.6 5.4-9.1 7.9-13.6c1.1-1.9 2.2-3.9 3.2-5.9zM0 176c0 41.8 17.2 80.1 45.9 110.3c-.9 1.7-1.9 3.5-2.8 5.1c-10.3 18.4-22.3 36.5-36.6 52.1c-6.6 7-8.3 17.2-4.6 25.9C5.8 378.3 14.4 384 24 384c43 0 86.5-13.3 122.7-29.7c4.8-2.2 9.6-4.5 14.2-6.8c15.1 3 30.9 4.5 47.1 4.5c114.9 0 208-78.8 208-176S322.9 0 208 0S0 78.8 0 176zM432 480c16.2 0 31.9-1.6 47.1-4.5c4.6 2.3 9.4 4.6 14.2 6.8C529.5 498.7 573 512 616 512c9.6 0 18.2-5.7 22-14.5c3.8-8.8 2-19-4.6-25.9c-14.2-15.6-26.2-33.7-36.6-52.1c-.9-1.7-1.9-3.4-2.8-5.1C622.8 384.1 640 345.8 640 304c0-94.4-87.9-171.5-198.2-175.8c4.1 15.2 6.2 31.2 6.2 47.8l0 .6c87.2 6.7 144 67.5 144 127.4c0 28-11.4 54.9-32.7 77.2c-14.3 15-17.3 37.6-7.5 55.8c1.1 2 2.2 4 3.2 5.9c2.5 4.5 5.2 9 7.9 13.6c-17-4.5-33.9-10.7-49.9-18c-4.3-1.9-8.5-3.9-12.6-6c-9.5-4.8-20.3-6.2-30.7-4.2c-12.1 2.4-24.7 3.6-37.8 3.6c-61.7 0-110-26.5-136.8-62.3c-16 5.4-32.8 9.4-50 11.8C279 439.8 350 480 432 480z" />
          </svg>

          {/* User info */}
          {user && (
            <div
              className="mb-5 border-2 rounded-md bg-[var(--autologin-bg)] flex items-center px-5 py-3"
              aria-label="User info"
            >
              <img
                src={user.image}
                alt={`${user.username} avatar`}
                className="rounded-full w-12 h-12 flex-shrink-0"
              />
              <div className="ml-5 overflow-hidden">
                <p
                  className="font-bold text-base text-[var(--login-text-color)] truncate max-w-[200px]"
                  title={user.username}
                >
                  {user.username}
                </p>
                <p
                  className="text-sm text-[var(--login-text-color)] truncate max-w-[230px]"
                  title={user.email}
                >
                  {user.email}
                </p>
              </div>
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!loading) handleSubmit();
            }}
            className="flex flex-col"
          >
            <label
              htmlFor="password"
              className="font-semibold text-blue-600 text-xs mb-1"
            >
              Password
            </label>
            <Tippy
              content={<PasswordTooltip status={validPwd} hasText={password} />}
              placement="left"
              trigger="focus"
              hideOnClick={false}
            >
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mb-6 w-full rounded-sm border-2 border-gray-200 p-2 outline-none focus:border-blue-600"
                aria-describedby="passwordHelp"
                aria-invalid={!validPwd && password !== ""}
                required
              />
            </Tippy>

            <label
              htmlFor="confirmPassword"
              className="font-semibold text-blue-600 text-xs mb-1"
            >
              Confirm Password
            </label>
            <Tippy
              content={
                <PasswordCfTooltip status={validMatch} hasText={cfPassword} />
              }
              placement="left"
              trigger="focus"
              hideOnClick={false}
            >
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={cfPassword}
                onChange={(e) => setCfPassword(e.target.value)}
                className="mb-6 w-full rounded-sm border-2 border-gray-200 p-2 outline-none focus:border-blue-600"
                aria-describedby="confirmPasswordHelp"
                aria-invalid={!validMatch && cfPassword !== ""}
                required
              />
            </Tippy>

            {message && (
              <p
                className={`mb-4 text-xs ${
                  hasError ? "text-red-500" : "text-green-500"
                }`}
                role="alert"
              >
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`rounded-md p-2 text-white font-semibold ${
                loading
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Processing..." : "Confirm"}
            </button>
          </form>

          {/* Back to login link */}
          <Link
            to="/login"
            className="text-xs mt-4 text-center text-blue-600 hover:underline"
          >
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Recover;
