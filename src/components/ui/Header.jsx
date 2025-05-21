import React from 'react'
import {
  
    Search
  } from "lucide-react";
import { useSelector } from 'react-redux';
import notificationImg from "../../assets/notifications.png"

export default function Header() {
  const user = useSelector(state => state.auth.user);
  
  return (
    <>
        <header className="flex justify-between items-center mb-12">
          <div className="flex bg-white  rounded-xl items-center px-3  gap-2 w-1/3">
            <Search size={18} className="text-black" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-white rounded-lg placeholder:text-[14px] px-4 py-2 w-full shadow-sm  border-gray-200"
            />
          </div>
          <div className="flex items-center gap-1 justify-between">
            <img src={notificationImg} width={40} height={40} alt="" />
            <div className='bg-white flex gap-2 items-center px-2 py-2 rounded-full'>
            <img
              src={user?.employee?.photo}
              className="w-7 h-7 rounded-full"
              alt="user"
            />
            <span className="font-semibold text-[12px]">{user?.employee?.name}</span>
            
            </div>
           
          </div>
        </header>
    </>
  )
}
