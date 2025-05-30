import { Route, Routes } from "react-router-dom";

import PersistLogin from "./components/persistlogin/PersistLogin.js";
import Authenticate from "./components/authenticate/Authenticate.js";

import NotFound from "./pages/home/NotFound.js";
import Settings from "./pages/home/Settings.js";
import Profile from "./pages/home/Profile.js";
import Groups from "./pages/home/Groups.js";
import Register from "./pages/auth/Register.js";
import Login from "./pages/auth/Login.js";
import Forgot from "./pages/auth/Forgot.js";
import Friends from "./pages/home/Friends.js";
import Location from "./pages/location/Location.js"

import { UserDataProvider } from "./context/UserDataProvider.js"
import useTheme from "./hooks/useTheme.js"
import Layout from "./components/Layout.js";
import Call from "./components/call/Call.js";
import Recover from "./pages/auth/Recover.js";

export default function App() {

  const { theme } = useTheme();

  return (
    <div id="theme" className={`${theme} w-screen h-screen`}>

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/recover" element={<Recover />} />
        <Route path="/*" element={<NotFound />} />

        {/* persist user login */}
        <Route element={<PersistLogin />}>
          {/* require authentication  */}
          <Route element={<Authenticate />}>
            <Route path="/location" element={<Location />} />
            {/* wrap Layout in a redux-like global state provider */}
            <Route path="/" element={<UserDataProvider><Layout /></UserDataProvider>}>
              {/* Nested routes */}

              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/groups" element={<Groups />} />
              <Route path="/friends" element={<Friends/>} />
            </Route>

            <Route path="/call/:callType/:callId/" element={<Call />} />

          </Route>
        </Route>
      </Routes>

    </div>
  );
}
