import React, { useState, useEffect } from "react";
import Tippy from "@tippyjs/react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%_?]).{6,24}$/;

function OldPasswordTooltip() {
  return `Must match current password of account`
}
function PasswordTooltip({ status, hasText }) {
  return `Password must contain 6 to 24 characters, must include uppercase and lowercase letters,
   a number, a special character ${hasText === "" ? "" : (status ? '✅' : '❌')}`
}
function PasswordCfTooltip({ status, hasText }) {
  return `Make sure your confirm password matches the one entered above ${hasText === "" ? "" : (status ? '✅' : '❌')}`
}

const ChangePasswordForm = () => {
  const axiosPrivate = useAxiosPrivate();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [matchPassword, setMatchPassword] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [validMatch, setValidMatch] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(newPassword));
    setValidMatch(newPassword === matchPassword);
  }, [newPassword, matchPassword])

  const handleSubmit = async () => {
    try {
      await axiosPrivate.post("/api/user/change-password", {
        oldPassword,
        newPassword,
        matchPassword,
      });
      setMessage("Password saved");
      setError(false);
      setOldPassword("");
      setNewPassword("");
      setMatchPassword("");
    } catch (error) {
      setError(true);
      console.log(error);
      setMessage(error.response.data);
    }
    setLoading(false);
  };

  return (
    <div className="h-auto w-auto  ">
      <div className="h-full w-full flex items-center justify-center">
        <div className="h-full w-full  border-gray-300 shadow-xl flex flex-col gap-2">
          <div className="mt-2 flex flex-col gap-8">
            <div className="ml-5 mr-5 relative">
              <label
                htmlFor="oldPassword"
                className="absolute px-1 font-semibold bg-[var(--settings-box-bg)] left-3 z-20 text-blue-600 text-xs"
              >
                Current Password
              </label>
              <Tippy
                hideOnClick="false"
                placement="right"
                trigger="focus"
                content={<OldPasswordTooltip />}>
                <input
                  type="password"
                  id="oldPassword"
                  className="outline-0 absolute top-2 z-10 rounded-sm py-1.5 pl-3 w-full 
                  bg-[var(--settings-box-bg)] text-[var(--login-input-text-color)] 
                  border-2 border-gray-300 duration-300 hover:border-cyan-600 focus:border-blue-700"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  style={{borderRadius: '10px'}}
                />
              </Tippy>
            </div>

            <div className="mt-5 ml-5 mr-5 relative">
              <label
                htmlFor="newPassword"
                className="absolute px-1 font-semibold bg-[var(--settings-box-bg)] left-3 z-20 text-blue-600 text-xs"
              >
                New Password
              </label>
              <Tippy
                hideOnClick="false"
                placement="right"
                trigger="focus"
                content={<PasswordTooltip status={validPwd} hasText={newPassword} />}>
                <input
                  type="password"
                  id="newPassword"
                  className="outline-0 absolute top-2 z-10 rounded-sm py-1.5 pl-3 w-full 
                  bg-[var(--settings-box-bg)] text-[var(--login-input-text-color)] 
                  border-2 border-gray-300 duration-300 hover:border-cyan-600 focus:border-blue-700"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{borderRadius: '10px'}}
                />
              </Tippy>
            </div>

            <div className="mt-5 ml-5 mr-5 relative">
              <label
                htmlFor="confirmNewPassword"
                className="absolute px-1 font-semibold bg-[var(--settings-box-bg)] left-3 z-20 text-blue-600 text-xs"
              >
                Confirm New Password
              </label>
              <Tippy
                hideOnClick="false"
                placement="right"
                trigger="focus"
                content={<PasswordCfTooltip status={validMatch} hasText={matchPassword} />}>
                <input
                  type="password"
                  id="confirmNewPassword"
                  className="outline-0 absolute top-2 z-10 rounded-sm py-1.5 pl-3 w-full 
                  bg-[var(--settings-box-bg)] text-[var(--login-input-text-color)] 
                  border-2 border-gray-300 duration-300 hover:border-cyan-600 focus:border-blue-700"
                  value={matchPassword}
                  onChange={(e) => setMatchPassword(e.target.value)}
                  style={{borderRadius: '10px'}}
                />
              </Tippy>
            </div>

            <div className={`${error ? 'text-red-600' : 'text-green-600'} mt-5 text-center relative`}>{message}</div>

            <div className="flex flex-col justify-center mb-5 mt-[-20px] mx-3 relative">
              <button
                onClick={() => {
                  setLoading(true);
                  handleSubmit();
                }}
                disabled={loading || !validMatch || !validPwd || !oldPassword}
                className="w-full h-10 bg-blue-500 text-white font-semibold rounded-md 
                hover:bg-blue-600 duration-300 flex justify-center items-center
                 disabled:bg-slate-500 disabled:hover:cursor-not-allowed"
              >
                {
                  loading ? <img src="/loading.png" className="w-9 h-9" alt=""></img> :
                    "Change password"
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordForm;
