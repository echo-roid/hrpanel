// Routers.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Event from "./components/ui/Event";
import Home from "./components/ui/Home";
import TasksPage from "./components/ui/TasksPage";
import CalendarPage from "./components/ui/Calendar";
import EmployeeList from "./components/ui/EmpList";
import Vacations from "./components/ui/Vacations.jsx";
import InfoPortal from "./components/ui/InfoPortal.jsx";
import Messenger from "./components/ui/Messenger.jsx";
import Proile from "./components/ui/ProfileDashboard.jsx";
import App from './App.js';
import Login from './auth/Login.js';
import ProtectedRoute from './ProtectedRounte/ProtectedRoute.jsx';
import LeaveNotification from './components/ui/LeaveNotification.jsx';
import ReimbursementForm from "./components/ui/ReimbursementForm.jsx"
import ReimbursementApproval from "./components/ui/ReimbursementApproval.jsx"
import ReimbursementList from "./components/ui/ReimbursementList.jsx"
import EmployeeFormStepper from "./components/ui/EmployeeFormStepper.jsx"
import AdminSetting from "./components/ui/setting.jsx"
import EmployeeListForm from "./components/ui/EmployeeListForm.jsx"

export default function Routers() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Protected App layout and nested routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <App />
            </ProtectedRoute>
          }
        >
          <Route path="Dashboard" element={<Home />} />
          <Route path="Projects" element={<TasksPage />} />
          <Route path="Calendar" element={<CalendarPage />} />
          <Route path="Employees" element={<EmployeeList />} />
          <Route path="Vacations" element={<Vacations />} />
          <Route path="InfoPortal" element={<InfoPortal />} />
          <Route path="Messenger" element={<Messenger />} />
          <Route path="Employees/:id" element={<Proile />} />
          <Route path="LeaveNotification/" element={<LeaveNotification />} />
          <Route path="ReimbursementForm/" element={<ReimbursementForm />} />
          <Route path="ReimbursementApproval/" element={<ReimbursementApproval />} />
          <Route path="ReimbursementList/" element={<ReimbursementList />} />
          <Route path = "EmpFormList/" element={<EmployeeListForm/>} />
        </Route>

        {/* Public Route */}
        <Route path="/login" element={<Login />} />
       
        <Route path="/EMPForm" element={<EmployeeFormStepper />} />
        <Route path="/AdminSetting" element={<AdminSetting />} />
      </Routes>
    </BrowserRouter>
  );
}
