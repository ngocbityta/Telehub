import React from "react";
import { Link, useLocation } from "react-router-dom";
import { BsChat, BsPerson, BsPeople, BsGear, BsPower } from "react-icons/bs";
import Tippy from "@tippyjs/react";
import 'tippy.js/dist/tippy.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import useLogout from "../../hooks/useLogout";

const navItems = [
  { path: "/", title: "Chats", icon: BsChat },
  { path: "/profile", title: "Profile", icon: BsPerson },
  { path: "/groups", title: "Groups", icon: BsPeople },
  { path: "/settings", title: "Settings", icon: BsGear }
];

const NavBar = () => {
  const location = useLocation();
  const logout = useLogout();

  const isActive = (path) => location.pathname === path;

  const logoutConfirm = () => {
    confirmAlert({
      title: 'Logout confirmation',
      message: 'Are you sure you want to log out?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => signOut()
        },
        {
          label: 'No',
        }
      ]
    });
  };

  const signOut = async () => {
    await logout();
  };

  return (
    <div className="flex flex-col items-center bg-[#e6f4ea] w-[80px] py-6 rounded-2xl shadow-sm">

      <div className="flex flex-col w-full h-full">
        <div>
          {navItems.map((item, index) => (
            <Tippy key={index} content={item.title} placement="right">
              <Link to={item.path}>
                <div
                  className={`w-10 h-10 mx-auto flex items-center justify-center rounded-xl transition-colors duration-300 mb-4
                  ${
                    isActive(item.path)
                      ? 'bg-[#3a7d3a] text-white'
                      : 'text-[#2c6e2c] hover:bg-[#b7deb7]'
                  }
                  border-b border-[#a7d7a7]
                  `}
                >
                  <item.icon className="w-5 h-5" />
                </div>
              </Link>
            </Tippy>
          ))}
        </div>

        {/* Nút logout luôn nằm dưới cùng */}
        <Tippy content="Logout" placement="right">
          <button
            onClick={logoutConfirm}
            className="w-10 h-10 mx-auto flex items-center justify-center rounded-xl text-[#2c6e2c] hover:bg-red-400 hover:text-white transition-colors duration-300 border-b border-[#a7d7a7] mt-auto"
          >
            <BsPower className="w-5 h-5" />
          </button>
        </Tippy>
      </div>
    </div>
  );
};

export default NavBar;
