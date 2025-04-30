import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import Tippy from "@tippyjs/react";

const FULLNAME_REGEX = /^[a-zA-Z\s]+$/;
const EMAIL_REGEX = /^([^\s@]+@[^\s@]+\.[^\s@]+)$/;

function FullnameTooltip({ status, hasText }) {
  return `Fullname must not contain special characters ${hasText === "" ? "" : (status ? '✅' : '❌')} `
}
function EmailTooltip({ status, hasText }) {
  return `Must be a valid email address ${hasText === "" ? "" : (status ? '✅' : '❌')}`
}

const ChangeInfoForm = () => {
  const { auth, setAuth } = useAuth();
  const axiosPrivate = useAxiosPrivate();

  const [fullname, setFullname] = useState(auth.fullname || "");
  const [validFullname, setValidFullname] = useState(false);

  const [email, setEmail] = useState(auth.email || "");
  const [validEmail, setValidEmail] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setValidFullname(FULLNAME_REGEX.test(fullname));
  }, [fullname])

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email))
  }, [email])

  const handleSubmit = async () => {

    try {
      const formData = new FormData();
      formData.append('image', avatar);
      formData.append('fullname', fullname);
      formData.append('email', email);

      const response = await axiosPrivate.post('/api/user/edit', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setAuth({
        ...auth, image: response.data.image, fullname: response.data.fullname, email: response.data.email
      })
      setAvatar(null);
      setMessage("Updated profile");
      setError(false);
    } catch (error) {
      setError(true);
      setMessage(error.response.data);
    }
    setLoading(false);
  };


  return (
    <div className="h-auto w-auto">
      <div className="h-full w-full flex items-center justify-center">
        <div className="h-full w-full border-gray-300 shadow-xl flex flex-col gap-2">
          <div className="mt-2 flex flex-col gap-8">
            {/* Avatar */}
            <div className="mx-5 relative flex items-center bg-[var(--file-input-container)] p-2 gap-2">
              {/* Uploaded data */}
              {avatar ? (
                <img
                  src={avatar?.preview}
                  alt="Avatar"
                  className="rounded-full w-20 h-20 object-cover"
                />
              ) : (
                <img
                  src={auth.image}
                  alt="Avatar"
                  className="rounded-full w-20 h-20 object-cover"
                />
              )}

              <label
                htmlFor="inputAvatar"
                className="cursor-pointer rounded border mr-[40px] px-[12px] py-[6px] 
                bg-[var(--file-input-btn)]
                text-black hover:border-gray-500">
                Upload Avatar
              </label>
              <input
                className="hidden"
                name="file"
                type="file"
                accept="image/*"
                id="inputAvatar"
                onChange={(e) => {
                  const file = e.target.files[0]
                  file.preview = URL.createObjectURL(file)
                  setAvatar(file)
                }}></input>

            </div>
            {/* Full Name */}
            <div className="ml-5 mr-5 relative">
              <label
                htmlFor="fullName"
                className="absolute px-1 font-semibold bg-[var(--settings-box-bg)] left-3 z-20 text-blue-600 text-xs"
              >
                Full Name
              </label>
              <Tippy
                hideOnClick="false"
                placement="right"
                trigger="focus"
                content={<FullnameTooltip status={validFullname} hasText={fullname} />}
              >
                <input
                  type="text"
                  id="fullName"
                  className="outline-0 absolute top-2 z-10 rounded-sm py-1.5 pl-3 w-full 
                  bg-[var(--settings-box-bg)] text-[var(--login-input-text-color)] 
                  border-2 border-gray-300 duration-300 hover:border-cyan-600 focus:border-blue-700"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                />
              </Tippy>
            </div>

            <div className="mt-5 ml-5 mr-5 relative">
              <label
                htmlFor="email"
                className="absolute px-1 font-semibold bg-[var(--settings-box-bg)] left-3 z-20 text-blue-600 text-xs"
              >
                Email
              </label>
              <Tippy
                hideOnClick="false"
                placement="right"
                trigger="focus"
                content={<EmailTooltip status={validEmail} hasText={email} />}>
                <input
                  type="email"
                  id="email"
                  className="outline-0 absolute top-2 z-10 rounded-sm py-1.5 pl-3 w-full 
                  bg-[var(--settings-box-bg)] text-[var(--login-input-text-color)] 
                  border-2 border-gray-300 duration-300 hover:border-cyan-600 focus:border-blue-700"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Tippy>
            </div>

            <div className={`${error ? 'text-red-600' : 'text-green-600'} mt-5 text-center relative`}>{message}</div>

            <div className="flex flex-col justify-center mb-7 mt-[-20px] mx-3 relative">
              <button
                disabled={loading || (!validEmail && email !== "") || (!validFullname && fullname !== "")
                  || (fullname === auth.fullname && email === auth.email && !avatar)}
                onClick={() => {
                  setLoading(true);
                  handleSubmit();
                }}
                className="w-full h-10 bg-blue-500 text-white font-semibold rounded-md
                 hover:bg-blue-600 duration-300 flex justify-center items-center 
                 disabled:bg-slate-500 disabled:hover:cursor-not-allowed"
              >
                {
                  loading ? <img src="/loading.png" className="w-9 h-9" alt=""></img> :
                    "Update information"
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeInfoForm;
