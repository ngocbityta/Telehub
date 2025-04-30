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

  const isActive = (path) => {
    return location.pathname === path;
  };

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
  }

  return (
    <div className="border flex flex-col gap-1 items-center bg-[var(--navbar-bg)] border-none">
      <h1 className="text-2xl text-black font-medium p-3">
        <img src={`${process.env.PUBLIC_URL}/appicon.png`} className="w-20 h-20" alt="app icon"></img>
      </h1>
      <div className="divider my-0"></div>
      <div className="flex flex-col gap-1 justify-between items-center w-full mt-9">
        {navItems.map((item, index) => (
          <Tippy key={index} content={item.title} placement="right">
            <div className={`rounded-[50%] w-[70px] h-[70px] flex items-center justify-center 
            ${isActive(item.path) ? 'bg-[var(--active-tab-bg)]' : 'hover:bg-[var(--tab-hover-bg)]'}`}>
              <Link to={item.path} className="w-full flex justify-center py-4">
                <span className="p-2 flex flex-row">
                  <item.icon className="w-6 h-6 text-[var(--tab-icon-color)]" />
                </span>
              </Link>
            </div>
          </Tippy>
        ))}
      </div>

      {/* Logout */}
      <div className="flex-1 flex flex-col justify-end pb-4">
        <div onClick={logoutConfirm} className='rounded-[50%] w-[70px] h-[70px] flex 
        items-center justify-center hover:bg-[var(--tab-hover-bg)]'>
          <div className="w-full flex justify-center">
            <span className="p-2 flex flex-row hover:fill-red-500">
              <BsPower className="w-6 h-6 text-[var(--tab-icon-color)] hover:fill-red-500" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
