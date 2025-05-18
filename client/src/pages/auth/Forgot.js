import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Tippy from "@tippyjs/react";
import axios from "axios";

const EMAIL_REGEX = /^([^\s@]+@[^\s@]+\.[^\s@]+)$/;

function Forgot() {
  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);

  const handleSubmit = async () => {
    if (!validEmail) {
      setMessage("Not a valid email address");
      setError(true);
      return;
    }

    setLoading(true);
    try {
      await axios.post("/api/auth/forgot", { email });
      setMessage("We've sent a recovery link. Check your email");
      setError(false);
      setEmail("");
    } catch (err) {
      setError(true);
      if (!err?.response) setMessage("No Server Response");
      else if (err.response?.status === 409) setMessage(err.response?.data);
      else setMessage("Internal Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
        <h2 className="text-2xl font-bold text-center text-indigo-600 mb-4">
          Forgot your password?
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Enter your registered email to receive a recovery link.
        </p>

        <Tippy
          hideOnClick={false}
          placement="right"
          trigger="focus"
          content={`Must be a valid email address ${
            email === "" ? "" : validEmail ? "✅" : "❌"
          }`}
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </Tippy>

        {message && (
          <div
            className={`mb-4 text-center text-sm ${
              error ? "text-red-600" : "text-green-600"
            }`}
          >
            {message}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!validEmail || loading}
          className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
        >
          {loading ? (
            <img src="/loading.png" alt="Loading" className="w-6 h-6 mx-auto" />
          ) : (
            "Submit"
          )}
        </button>

        <div className="mt-6 text-center text-gray-600 text-sm">
          Remember your password?
          <Link to="/login" className="ml-2 text-indigo-600 hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Forgot;
