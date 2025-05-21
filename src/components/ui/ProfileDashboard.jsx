import React, { useEffect, useState } from "react";
import { Pencil, CalendarDays, MapPin, Trash, Archive } from "lucide-react";
import projectimg from "../../assets/projectimg.png"
import leftarrow from "../../assets/leftarrow.png"
import { Filter, X } from "lucide-react";
import priority from "../../assets/priority.png"
import { motion } from "framer-motion";
import pencil from "../../assets/pencil.png"
import { Switch } from "@headlessui/react";
import { Bell, ShieldCheck, User, Building2, AppWindow, CreditCard, Lock } from 'lucide-react'
import dayjs from "dayjs";
import progress from "../../assets/progress.png"
import setting from "../../assets/Setting.png"
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployees } from "../../redux/slices/employeeSlice";







const ProfileSidebar = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("Projects");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [employees, setEmployees] = useState()





  useEffect(() => {
    async function fetchLeaveStatusList() {
      try {
        const res = await fetch(`http://localhost:5000/api/employees/${id}`);
        const result = await res.json();
        if (result) {
          setEmployees(result);
          console.log(result)
          // console.log(result)


          // render in UI
        } else {
          console.error('Server Error:', result.error);
        }
      } catch (err) {
        console.error('Network Error:', err);
      }
    }
    fetchLeaveStatusList()
  }, [])



  async function deleteEmployee() {
    try {
      const response = await fetch(`http://localhost:5000/api/employees/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete employee');
      }

      alert('Employee deleted successfully');
      // Optionally refresh UI here
    } catch (error) {
      console.error('Delete Error:', error.message);
      alert(`Error: ${error.message}`);
    }
  }

  async function softDeleteEmployee() {
    try {
      const response = await fetch(`http://localhost:5000/api/employees/${id}/soft-delete`, {
        method: 'PATCH',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to deactivate employee');
      }

      alert('Employee deactivated successfully');
      // Optionally refresh UI here
    } catch (error) {
      console.error('Soft Delete Error:', error.message);
      alert(`Error: ${error.message}`);
    }
  }









  return (
    <div className=" py-4  text-sm">
      <h1 className="text-2xl font-semibold mb-8 px-2 flex justify-between items-center">My Profile  <img src={setting} className="" width={35} height={35} alt="" /></h1>

      <div className="flex gap-8">
        <div className="bg-white rounded-2xl shadow p-4 w-[250px] relative">
          <Trash className="w-6 h-6 text-red-500 absolute top-4 bg-[#f4f9fd] p-1 rounded-md shadow cursor-pointer right-[3rem]" onClick={deleteEmployee} />
          <Archive
            className="w-6 h-6 text-yellow-600 hover:text-yellow-800 absolute top-4 bg-[#f4f9fd] p-1 rounded-md shadow  right-[5rem] cursor-pointer"
            onClick={softDeleteEmployee}
          />

          <img src={pencil} alt="pencil" className="absolute top-4 w-[25px] h-[25px] right-4 bg-[#f4f9fd] cursor-pointer p-1 rounded-md shadow" />
          <div className="flex flex-col mt-4">
            <img
              src={employees?.photo} // Replace with your actual image
              alt="Profile"
              className="w-16 h-16 rounded-full border-4 border-white shadow -mt-6"
            />
            <div className="mt-2 ">
              <div className="font-semibold text-sm mb-2">{employees?.name}</div>
              <div className="text-gray-500 text-xs">{employees?.level}-{employees?.designation}</div>
            </div>
          </div>

          <div className="mt-4 border-t pt-4">
            <h3 className="text-[13px] font-semibold mb-2">Main info</h3>

            <div className="space-y-2">
              <label className="block text-xs text-gray-500">Position</label>
              <input
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs"
                value={employees?.designation}
                readOnly
              />




              {/* <label className="block text-xs text-gray-500">Company</label>
              <input
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs"
                value="Cadabra"
                readOnly
              /> */}

              <label className="block text-xs text-gray-500">Location</label>
              <div className="relative">
                <input
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs pr-8"
                  value={employees?.house_address}
                  readOnly
                />
                <MapPin size={14} className="absolute top-2.5 right-3 text-gray-400" />
              </div>

              <label className="block text-xs text-gray-500">Birthday Date</label>
              <div className="relative">
                <input
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs pr-8"
                  value={employees?.date_of_birth?.split("T")[0]}
                  readOnly
                />
                <CalendarDays size={14} className="absolute top-2.5 right-3 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-[13px] font-semibold mb-2">Contact Info</h3>

            <div className="space-y-2">
              <label className="block text-xs text-gray-500">Email</label>
              <input
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs"
                value={employees?.email}
                readOnly
              />

              <label className="block text-xs text-gray-500">Mobile Number</label>
              <input
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs"
                value={employees?.contact_number}
                readOnly
              />

              <label className="block text-xs text-gray-500">Manager</label>
              <input
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs"
                value={employees?.reporting_manager}
                readOnly
              />


              <label className="block text-xs text-gray-500">Password</label>
              <input
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs"
                value={employees?.password_plain}
                readOnly
              />
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between bg-[#f4f9fd]  py-2 rounded-full w-full mb-5">
            {/* Tabs */}
            <div className="flex items-center bg-[#e8f0fc] rounded-full p-1 gap-2">
              {["Projects", "Team", "My vacations"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1 rounded-full text-sm font-medium transition-all ${activeTab === tab
                    ? "bg-[#2f80ed] text-white shadow"
                    : "text-gray-600"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Filter & Dropdown */}
            <div className="flex items-center gap-2 relative">
              <button className="bg-white p-2 rounded-lg shadow">
                <Filter size={16} className="text-gray-600" />
              </button>

              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="bg-white px-4 py-2 rounded-lg shadow text-sm flex items-center gap-1"
                >
                  Current Projects
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 8L10 12L14 8"
                      stroke="black"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-md z-10">
                    <div className="py-2 text-sm text-gray-700">
                      <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        All Projects
                      </div>
                      <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        Archived
                      </div>
                      <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        Completed
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {
            activeTab === "Projects" ? <ProjectCard /> : activeTab === "Team" ? <GridUser team={employees?.team_name} /> : <LeaveDashboard />
          }




        </div>
      </div>

    </div>


  );
};

export default ProfileSidebar;


const ProjectCard = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm flex overflow-hidden w-full max-w-4xl">
      {/* Left Section */}
      <div className="flex-1 p-6 space-y-2">
        <div className='flex gap-3'>
          <img src={projectimg} alt="projectimg" />
          <div>
            <p className="text-xs text-gray-400 ">PN0001265</p>
            <p className="text-lg font-semibold text-gray-900">
              Medical App (iOS native)
            </p>
          </div>

        </div>
        <div className='flex justify-between'>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <CalendarDays className="w-4 h-4" />
            Created Sep 12, 2020
          </div>
          <div className="text-yellow-500 font-medium flex items-center gap-1 text-sm">

            <span className="text-base font-bold"><img src={priority} alt="priority" className='w-[10px] h-[15px]' /></span> Medium
          </div>
        </div>

      </div>

      {/* Right Section */}
      <div className="bg-white border-l px-6 py-4 flex flex-1 flex-col justify-center">
        <h3 className=" font-semibold text-gray-900 mb-2">Project Data</h3>
        <div className="flex gap-10">
          <div>
            <div className="text-xs text-[#91929E]">All tasks</div>
            <div className="text-base font-bold text-gray-800">34</div>
          </div>
          <div>
            <div className="text-xs text-[#91929E]">Active tasks</div>
            <div className="text-base font-bold text-gray-800">13</div>
          </div>
          <div>
            <div className="text-xs text-[#91929E]">Assignees</div>
            <div className="flex -space-x-2 mt-1">
              <img src={`https://randomuser.me/api/portraits/men/32.jpg`} className="w-6 h-6 rounded-full border-2 border-white" alt="" />
              <img src={`https://randomuser.me/api/portraits/men/33.jpg`} className="w-6 h-6 rounded-full border-2 border-white" alt="" />
              <img src={`https://randomuser.me/api/portraits/men/34.jpg`} className="w-6 h-6 rounded-full border-2 border-white" alt="" />
              <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-semibold flex items-center justify-center border-2 border-white">
                +2
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



const GridUser = ({ team }) => {

  const dispatch = useDispatch();

  const { list: employeesRedux, status: status, error: errors } = useSelector((state) => state.employee);
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchEmployees());
    }
  }, [status, dispatch]);
  const itTeamLeaves = employeesRedux.filter(item => item.team_name.toLowerCase() === team.toLowerCase());


  return (
    <div className="grid grid-cols-4 gap-4 ">
      {itTeamLeaves.map((elem, i) => (
        <motion.div
          key={i}
          whileHover={{ scale: 1.04 }}
          className=" shadow rounded-xl p-3 bg-[#F4F9FD] text-center"
        >
          <img
            src={elem?.photo}
            className="mx-auto rounded-full w-12 h-12 mb-2"
            alt="user"
          />
          <p className="font-medium text-sm">{elem?.name}</p>
          <p className="text-xs mt-2 text-gray-500">{elem?.designation}</p>
          <p className="text-[#7D8592] text-[12px] font-semibold mt-2 inline-block py-1 px-3 border-[#7D8592] border-2 rounded-lg">{elem?.level}</p>
        </motion.div>
      ))}
    </div>
  )
}







const LeaveDashboard = () => {
  const { id } = useParams();
  const [leaveData, setLeaveData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [empDatas, setEmpDatas] = useState([]);



  useEffect(() => {
    async function fetchLeaveBalance() {
      try {
        const response = await fetch(`http://localhost:5000/api/leave/${id}`);

        if (!response.ok) {
          throw new Error('Failed to fetch leave balance');
        }

        const result = await response.json();
        setLeaveData(result.data.balances);
      } catch (err) {
        console.error('Error fetching leave balance:', err);
        setError('Failed to load leave balance sick_leave');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchLeaveBalance();
    }
  }, [id]);

  useEffect(() => {
    async function fetchLeaveStatusList() {
      try {
        const res = await fetch(`http://localhost:5000/api/leave/specific/${id}`);
        const result = await res.json();
        if (result.success) {
          setEmpDatas(result.data);
          // render in UI
        } else {
          console.error('Server Error:', result.error);
        }
      } catch (err) {
        console.error('Network Error:', err);
      }
    }
    fetchLeaveStatusList()
  }, [])

  return (
    <div className="py-6 space-y-6 bg-[#f4f9fd] min-h-screen">
      {/* Leave cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <div

          className="bg-white p-4 rounded-xl shadow-sm "
        >
          <div
            className={`w-14 h-14  rounded-full border-4 flex items-center justify-center mb-2 text-cyan-500 border-cyan-200`}
          >
            <span className={`text-lg font-bold text-cyan-500 border-cyan-200`}>
              {leaveData?.sick_leave}
            </span>
          </div>
          <h4 className="font-semibold text-gray-800">Sick Leave</h4>
          <p className="text-[11px] text-[#91929E] ">
            {leaveData?.sick_leave} days available
          </p>
        </div>


        <div

          className="bg-white p-4 rounded-xl shadow-sm "
        >
          <div
            className={`w-14 h-14  rounded-full border-4 flex items-center justify-center mb-2 text-red-500 border-red-200`}
          >
            <span className={`text-lg font-bold text-red-500 border-red-200`}>
              {leaveData?.vacation_leave}
            </span>
          </div>
          <h4 className="font-semibold text-gray-800">Vacation Leave</h4>
          <p className="text-[11px] text-[#91929E] ">
            {leaveData?.vacation_leave} days available
          </p>
        </div>


        <div

          className="bg-white p-4 rounded-xl shadow-sm "
        >
          <div
            className={`w-14 h-14  rounded-full border-4 flex items-center justify-center mb-2 text-purple-600 border-purple-200`}
          >
            <span className={`text-lg font-bold text-purple-600 border-purple-200`}>
              {leaveData?.total_leave_taken}
            </span>
          </div>
          <h4 className="font-semibold text-gray-800">Total Leave</h4>
          <p className="text-[11px] text-[#91929E] ">
            {leaveData?.total_leave_taken} days available
          </p>
        </div>

      </div>

      {/* My Requests */}


      <div className="space-y-4">
        {empDatas.map((elem, index) => (
          <div
            key={index}
            className="bg-white shadow-sm rounded-xl px-4 py-4 flex justify-between items-center "
          >
            <div className=" text-[10px] w-1/4">
              <p className="text-gray-500">Name</p>
              <div className="flex gap-2 items-center">
                <div className="w-[8px] h-[8px] rounded-full bg-blue-500">

                </div>
                <p className="font-semibold text-gray-800 mb-0">{elem?.employee_name}</p>
              </div>

            </div>
            <div className="text-[10px] text-gray-500 w-1/5">
              <p>Employee Team</p>
              <p className="font-medium text-black">{elem?.employee_team}</p>
            </div>
            <div className="text-[10px] text-gray-500 w-1/5">
              <p>Leave Type</p>
              <p className="font-medium text-black">{elem?.leave_type}</p>
            </div>
            {/* <div className="w-[80px] flex items-center gap-2">
                 <img
                   src={elem.assignee}
                   alt="avatar"
                   className="w-8 h-8 rounded-full border"
                 />
               </div> */}
            {/* <div className="w-1/5 flex items-center gap-2">
                 <span className={`text-[10px] font-medium ${task.priorityColor}`}>
                   ↑ {task.priority}
                 </span>
                
               </div> */}

            <div className="w-1/5 text-[10px] text-gray-500  font-medium ">
              <p>Date Requested</p>
              <span className={`text-[10px] font-medium text-blue-500`}>
                {elem?.days_requested}
              </span>

            </div>
            <div className="w-1/6 text-[10px] text-gray-500  font-medium">
              <p>Status</p>
              <span
                className={`text-[10px] px-2 py-1 rounded-full font-medium text-yellow-500`}
              >
                {elem?.status}
              </span>
            </div>

            <div className="w-[30px]">
              <img src={progress} alt=" progress" width={15} className="mx-auto" />
            </div>

          </div>

        ))}
      </div>


    </div>
  );
};





const AddRequestModal = ({ onClose }) => {
  const [requestType, setRequestType] = useState("Vacation");
  const [tab, setTab] = useState("Days");
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(dayjs());

  const startDay = currentMonth.startOf("month").day(); // day index (0–6)
  const daysInMonth = currentMonth.daysInMonth();

  const generateCalendar = () => {
    const calendarDays = [];
    for (let i = 0; i < startDay; i++) {
      calendarDays.push(null); // empty slot
    }
    for (let i = 1; i <= daysInMonth; i++) {
      calendarDays.push(i);
    }
    return calendarDays;
  };

  const calendar = generateCalendar();

  const handlePrevMonth = () => {
    setCurrentMonth(currentMonth.subtract(1, "month"));
  };

  const handleNextMonth = () => {
    setCurrentMonth(currentMonth.add(1, "month"));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
      <div className="bg-white w-[360px] rounded-2xl shadow-lg p-5 px-10 relative  overflow-y-auto">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-black"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        {/* Title */}
        <h2 className="text-lg font-semibold mb-4">Add Request</h2>

        {/* Request Type */}
        <p className="text-[#7D8592] text-[11px] mb-2 font-bold">Request Type</p>
        <div className="flex justify-between mb-4">
          {["Vacation", "Sick Leave", "Work remotely"].map((type) => (
            <button
              key={type}
              onClick={() => setRequestType(type)}
              className={`px-3 py-1 rounded-lg border text-[11px] font-medium ${requestType === type
                ? "bg-blue-100 text-blue-600 border-blue-200"
                : "bg-white text-gray-600 border-gray-300"
                }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Days / Hours Tabs */}
        <div className="flex mb-4 bg-gray-100 rounded-full p-1">
          {["Days", "Hours"].map((label) => (
            <button
              key={label}
              onClick={() => setTab(label)}
              className={`w-1/2 text-sm font-medium py-1 rounded-full ${tab === label ? "bg-blue-500 text-white" : "text-gray-600"
                }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Calendar */}
        <div className="text-center mb-2 border-[1px] rounded-lg p-2">
          <div className="flex justify-between items-center mb-2 px-2">
            <button
              onClick={handlePrevMonth}
              className="text-lg font-bold text-gray-500 hover:text-black"
            >
              ←
            </button>
            <span className="text-sm font-medium text-gray-700">
              {currentMonth.format("MMMM, YYYY")}
            </span>
            <button
              onClick={handleNextMonth}
              className="text-lg font-bold text-gray-500 hover:text-black"
            >
              →
            </button>
          </div>

          <div className="grid grid-cols-7 text-xs text-gray-400 mb-1">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <div key={d} className="text-center">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 text-sm text-gray-700">
            {calendar.map((d, i) => (
              <div key={i} className="text-center">
                {d ? (
                  <button
                    onClick={() => setSelectedDate(d)}
                    className={`w-8 h-8 rounded-full ${selectedDate === d
                      ? "bg-cyan-500 text-white font-semibold"
                      : "hover:bg-gray-200"
                      }`}
                  >
                    {d}
                  </button>
                ) : (
                  <div className="w-8 h-8" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Send Button */}
        <button className="w-[100px] mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 float-right rounded-lg text-[11px] font-medium">
          Send Request
        </button>
      </div>
    </div>
  );
};





const NotificationToggle = ({ title, description, enabled, onChange }) => (
  <div className="flex items-center justify-between px-4 py-3 rounded-lg border bg-white shadow-sm mb-3">
    <div>
      <p className="font-medium text-gray-800 text-sm">{title}</p>
      <p className="text-gray-400 text-xs mt-1">{description}</p>
    </div>
    <Switch
      checked={enabled}
      onChange={onChange}
      className={`${enabled ? 'bg-blue-500' : 'bg-gray-300'}
        relative inline-flex h-5 w-9 items-center rounded-full transition-colors`}
    >
      <span
        className={`${enabled ? 'translate-x-4' : 'translate-x-1'
          } inline-block h-3 w-3 transform rounded-full bg-white transition-transform`}
      />
    </Switch>
  </div>
);

const SettingsNotifications = () => {
  const [issueActivity, setIssueActivity] = useState(true);
  const [trackingActivity, setTrackingActivity] = useState(false);
  const [newComments, setNewComments] = useState(false);
  const [noNotificationsAfter, setNoNotificationsAfter] = useState(true);

  const menuItems = [
    { name: 'Account', icon: User },
    { name: 'Notifications', icon: Bell, active: true },
    { name: 'My Company', icon: Building2 },
    { name: 'Connected Apps', icon: AppWindow },
    { name: 'Payments', icon: CreditCard },
    { name: 'Confidentiality', icon: Lock },
    { name: 'Safety', icon: ShieldCheck },
  ];

  return (
    <>
      <div className="flex gap-2 items-center mb-4">
        <img src={leftarrow} alt="leftarrow" />
        <h3 className=" font-bold text-[18px] ">Settings</h3>
      </div>

      <div className="min-h-screen bg-[#f4f8fb] flex gap-6">
        {/* Sidebar */}
        <div className="w-[220px] bg-white rounded-2xl p-4 shadow-sm">

          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li
                key={item.name}
                className={`flex items-center gap-3 p-2 text-sm rounded-lg cursor-pointer transition ${item.active ? 'bg-blue-100 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                <item.icon size={16} />
                {item.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Notifications</h2>

          <NotificationToggle
            title="Issue Activity"
            description="Send me email notifications for issue activity"
            enabled={issueActivity}
            onChange={setIssueActivity}
          />
          <NotificationToggle
            title="Tracking Activity"
            description="Send me notifications when someone've tracked time in tasks"
            enabled={trackingActivity}
            onChange={setTrackingActivity}
          />
          <NotificationToggle
            title="New Comments"
            description="Send me notifications when someone've sent the comment"
            enabled={newComments}
            onChange={setNewComments}
          />

          <div className="mt-6">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-blue-500"
                checked={noNotificationsAfter}
                onChange={() => setNoNotificationsAfter(!noNotificationsAfter)}
              />
              <span className="ml-2 text-sm text-gray-700">Don’t send me notifications after 9:00 PM</span>
            </label>
          </div>
        </div>
      </div>
    </>

  );
};

