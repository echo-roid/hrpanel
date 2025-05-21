import React, { Children } from "react";
import {
  Bell,
  Calendar,
  Menu,
  Search,
  Users,
  Clock,
  CalendarDays
} from "lucide-react";

import { motion } from "framer-motion";
import arrow from "./assets/arrow.png"
import Side from "./components/ui/Sidebar"

import "./App.css"
import Header from "./components/ui/Header";
import { Outlet, useNavigate } from "react-router-dom";




const App = () => {



    
  
    
  
  return (
    <div className="min-h-screen bg-[#f4f7fe] text-gray-800 flex font-sans">
      {/* Sidebar */}
      <Side/>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
      <Header/>
   

      <Outlet />
      
        

        


      </main>
    </div>
  );
};



export default App;