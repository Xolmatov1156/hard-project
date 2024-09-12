import React from 'react';
import { NavLink } from 'react-router-dom';
import Logo from '../assets/logo.svg'

function Header() {
  return (
    <>
    <ul className="flex space-x-4 h-[80px] text-white bg-violet-500 ">
      <img src={Logo} alt="logo" className='scale-50'/>
      <li className="py-[20px] h-[50px] pl-[550px]">
        <NavLink to="/" aria-label="Dashboard">Dashboard</NavLink>
      </li>
      <li className="py-[20px] h-[50px]">
        <NavLink to="/add" aria-label="Add">Add User</NavLink>
      </li>
    </ul>
    </>
  );
}

export default Header;
