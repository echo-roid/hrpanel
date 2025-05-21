import React from 'react'
import logo from "../../assets/Company'slogo.png"
import logout from "../../assets/logout.png"
import support from "../../assets/Support.png"
import {
  Bell,
  Calendar,
  Menu,
  Users,
  Wallet,
  ListTodo,
  Receipt,
} from "lucide-react";

import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Simulating user role (replace with actual user context or prop)

export default function Sidebar() {
      const user = useSelector((state) => state.auth.user);
  const location = useLocation();
  const currentPath = location.pathname.toLowerCase();

  const isHr = user?.employee?.designation === 'HR';

  const EmpId = user?.employee?.id

  const navItems = [
    { icon: <Menu size={18} />, text: "Dashboard", path: "/dashboard" },
    // { icon: <Users size={18} />, text: "Projects", path: "/projects", hrOnly: true },
    { icon: <Calendar size={18} />, text: "Calendar", path: "/calendar" },
    { icon: <Calendar size={18} />, text: "Vacations", path: "/vacations" },
    { icon: <Users size={18} />, text: "Employees", path: "/employees", hrOnly: true },
    { icon: <Bell size={18} />, text: "Messenger", path: "/messenger", hrOnly: true },
    { icon: <Menu size={18} />, text: "InfoPortal", path: "/infoportal", hrOnly: true },
    { icon: <Users size={18} />, text: "My Profile", path: `/Employees/${EmpId}` },
    { icon: <Wallet size={18} />, text: "ReimbForm", path: `/ReimbursementForm` },
    { icon: <Receipt size={18} />, text: "ReimbList", path: `/ReimbursementList` },
    { icon: <ListTodo size={18} />, text: "EmpFormList", path: `/EmpFormList`, hrOnly: true },
  ];

  // Filter based on role
  const filteredNavItems = navItems.filter(item => isHr || !item.hrOnly);

  return (
    <aside className="w-50 bg-white p-6 py-10 shadow-md flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 text-blue-600 font-bold text-xl mb-8">
          <img src={logo} alt="logo" />
        </div>
        <nav className="space-y-6">
          {filteredNavItems.map(item => (
            <NavItem
              key={item.path}
              icon={item.icon}
              text={item.text}
              path={item.path}
              active={currentPath === item.path}
            />
          ))}
        </nav>
      </div>
      <div className="mt-8">
        <img src={support} className="mb-10 w-[80%]" alt="support" />
        <button className="w-full py-2 rounded-lg flex gap-3 text-blue-600 hover:bg-blue-50 font-medium">
          <img src={logout} alt="logout" /> <p className="text-[#7D8592]">Logout</p>
        </button>
      </div>
    </aside>
  );
}

const NavItem = ({ icon, text, path, active = false }) => (
  <div
    className={`flex items-center gap-3 px-4 py-2 relative rounded-lg cursor-pointer text-sm font-medium ${active ? "bg-blue-100 text-blue-600 activetabbar" : "hover:bg-gray-100"
      }`}
  >
    {icon} <span><Link to={path}>{text}</Link></span>
  </div>
);
