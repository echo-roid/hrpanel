import React, { use, useEffect, useState } from 'react'
import {
    // Bell,
    // Calendar,
    // Menu,
    // Search,
    // Users,
    
    Clock,
    CalendarDays,Gift
} from "lucide-react";
import { motion } from "framer-motion";
import projectimg from "../../assets/projectimg.png"
import arrow from "../../assets/arrow.png"
// import Calendaricon from '../../assets/calendar.png';
import priority from "../../assets/priority.png"
import { ArrowDown, Paperclip, UploadCloud } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProjects } from '../../redux/slices/projectSlice';
import { fetchEmployees } from '../../redux/slices/employeeSlice';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import AttendanceSummary from './Attadance';
import MonthlyAttendanceTable from './attendanceTable';








export default function Home() {
    const dispatch = useDispatch();
    const employeeList = useSelector((state) => state.employee.list);
    const user = useSelector((state) => state.auth.user);
    const { projectList, status } = useSelector((state) => state.projects)
    const [teamStatus, setTeamStatus] = useState([]);
    const [itTeamLeaves, setItTeamLeaves] = useState([]); // ✅ use state
    const [loading, setLoading] = useState(true);
    const [meetings, setMeetings] = useState([]);
    
    const organizerId = user?.employee?.id;
    
    useEffect(() => {
        dispatch(fetchProjects());
    }, [dispatch]);
    
    useEffect(() => {
        if (status === "idle") {
            dispatch(fetchEmployees());
        }
    }, [status, dispatch]);
    
    // ✅ HR Team Attendance
    useEffect(() => {
        const fetchHRTeamAttendance = async () => {
            if (user?.employee?.designation !== "HR") return;
    
            try {
                const res = await fetch('http://localhost:5000/api/attendance/team-attendance-status');
                const data = await res.json();
                setTeamStatus(data.team_status || []);
    
                const updatedList = employeeList.map(emp => {
                    const match = data?.team_status.find(s => s.employee_id === emp.id);
                    return {
                        ...emp,
                        status: match ? match.status : 'unknown',
                    };
                });
    
                setItTeamLeaves(updatedList); // ✅ update state
                setLoading(false);
            } catch (err) {
                console.error('Error fetching team attendance:', err);
                setLoading(false);
            }
        };
    
        fetchHRTeamAttendance();
    }, [user, employeeList]);
    
    // ✅ Non-HR Team Attendance
    useEffect(() => {
        const fetchNonHRTeamAttendance = async () => {
            if (user?.employee?.designation === "HR") return;
    
            try {
                const res = await fetch(`http://localhost:5000/api/attendance/team/${user?.employee?.team_name}`);
                const data = await res.json();
                setTeamStatus(data.team_status || []);
    
                const filteredTeam = employeeList.filter(item =>
                    item.team_name.toLowerCase() === user?.employee?.team_name?.toLowerCase()
                );
    
                const updatedList = filteredTeam.map(emp => {
                    const match = data?.team_status.find(s => s.employee_id === emp.id);
                    return {
                        ...emp,
                        status: match ? match.status : 'unknown',
                    };
                });
    
                setItTeamLeaves(updatedList); // ✅ update state
            } catch (err) {
                console.error('Error fetching team attendance:', err);
            }
        };
    
        fetchNonHRTeamAttendance();
    }, [user, employeeList]);


    

   



    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
  


    return (
        <>


            <div>
                <p className="text-[#7D8592] mb-3">Welcome back, {user?.employee?.name}!</p>

                <h2 className="text-2xl font-bold mb-8 text-[36px]">Dashboard</h2>

                <AttendanceSummary />
                <MonthlyAttendanceTable month={month} year={year} />
                <div className="flex gap-5 mb-5 mt-5">
                    {/* Workload Section */}
                    <div className="w-[70%] ">

                        <SectionCard title="Workload">
                            <div className="grid grid-cols-4 gap-4  ">
                                {itTeamLeaves.map((elem, i) => (
                                    <>

                                        <motion.div
                                            key={i+3}
                                            whileHover={{ scale: 1.04 }}
                                            className=" shadow rounded-xl p-3 bg-[#F4F9FD] h-[175px] text-center"
                                        >
                                            {/* <p className='className="font-medium text-[11px]'>{}</p> */}

                                            <div className={`w-[10px] h-[10px] ${elem.status === "present" ? "bg-sky-500" : elem.status === "not_present" ? "bg-red-500": "bg-[yellow]"}  rounded-full`}>

                                            </div>
                                            <img
                                                src={elem?.photo}
                                                className="mx-auto rounded-full w-12 h-12 mb-2"
                                                alt="user"
                                            />
                                            <p className="font-medium text-sm"> {elem.name.length > 10 ? `${elem.name.slice(0, 10)}...` : elem.name}</p>
                                            <p className="text-xs mt-2 text-gray-500"> {elem.designation.length > 10
                                                ? `${elem.designation.slice(0, 10)}...`
                                                : elem.designation}</p>
                                            <p className="text-[#7D8592] text-[12px] font-semibold mt-2 inline-block py-1 px-3 border-[#7D8592] border-2 rounded-lg">Junior</p>
                                        </motion.div>

                                    </>

                                ))}
                            </div>
                        </SectionCard>
                    </div>

                    {/* Events and Activity Stream */}
                    <div className="w-[30%]">
                        <NearestEvents />
                    </div>
                </div>




                {/* Projects Section */}

                <div className='flex gap-3'>
                    <div className="w-[70%]">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-[21px] font-semibold">Project</h3>
                            <button className="text-sm text-blue-500 flex gap-2 items-center hover:underline">View all <img src={arrow} alt="arrow" /></button>
                        </div>

                        {/* <ProjectCard />
                    <ProjectCard />
                    <ProjectCard /> */}
                        {
                            projectList?.map((elem, index) =>
                                index < 3 &&
                                <ProjectCard elem={elem} key={index} />
                            )
                        }
                    </div>
                    <div className="w-[30%] bg-white border rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Activity Stream</h2>

                        {/* Oscar Holloway */}
                        <div className="flex items-center mb-2">
                            <img
                                src="https://randomuser.me/api/portraits/men/32.jpg"
                                alt="Oscar Holloway"
                                className="w-10 h-10 rounded-full object-cover mr-3"
                            />
                            <div>
                                <p className="text-sm font-medium text-gray-900">Oscar Holloway</p>
                                <p className="text-xs text-gray-500">UI/UX Designer</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-2 bg-[#f4f8fe] text-sm text-gray-700 rounded-lg px-4 py-2 mb-2">
                            <UploadCloud size={35} className="text-blue-500 mt-1" />
                            <p>Updated the status of Mind Map task to In Progress</p>
                        </div>

                        <div className="flex items-start gap-2 bg-[#f4f8fe] text-sm text-gray-700 rounded-lg px-4 py-2 mb-4">
                            <Paperclip size={15} className="text-purple-500 mt-1" />
                            <p>Attached files to the task</p>
                        </div>

                        {/* Emily Tyler */}
                        <div className="flex items-center mb-2">
                            <img
                                src="https://randomuser.me/api/portraits/women/44.jpg"
                                alt="Emily Tyler"
                                className="w-10 h-10 rounded-full object-cover mr-3"
                            />
                            <div>
                                <p className="text-sm font-medium text-gray-900">Emily Tyler</p>
                                <p className="text-xs text-gray-500">Copywriter</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-2 bg-[#f4f8fe] text-sm text-gray-700 rounded-lg px-4 py-2 mb-4">
                            <UploadCloud size={35} className="text-blue-500 mt-1" />
                            <p>Updated the status of Mind Map task to In Progress</p>
                        </div>

                        <div className="text-blue-500 text-sm font-medium text-center cursor-pointer hover:underline">
                            View more <ArrowDown size={14} className="inline ml-1" />
                        </div>
                    </div>
                </div>


                           


            </div>
        </>

    )
}


const SectionCard = ({ title, children }) => (

    <div className="bg-white shadow h-[310px] overflow-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-100 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button className="text-sm text-blue-500 flex gap-2 items-center hover:underline">View all <img src={arrow} alt="arrow" /></button>
        </div>
        {children}
    </div>
);

// const NavItem = ({ icon, text, active = false }) => (
//     <div
//         className={`flex items-center gap-3 px-4 py-2  relative rounded-lg cursor-pointer text-sm font-medium ${active ? "bg-blue-100 text-blue-600 activetabbar" : "hover:bg-gray-100"
//             }`}
//     >
//         {icon} <span>{text}</span>
//     </div>
// )


const ArrowIcon = ({ direction }) => (
    <span
        className={`text-xs ${direction === "up" ? "text-yellow-500" : "text-green-500"
            }`}
    >
        {direction === "up" ? "▲" : "▼"}
    </span>
);






const NearestEvents = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [meetings, setMeetings] = useState([]);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("meetings");
  
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
  
    const user = useSelector((state) => state.auth.user);
    const organizerId = user?.employee?.id;
  
    const fetchCalendarEvents = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/calendar?month=${currentMonth}&year=${currentYear}`
        );
        if (!response.ok) throw new Error("Failed to fetch calendar events");
        const data = await response.json();
        setEvents(data.data);
      } catch (err) {
        console.error("Fetch calendar error:", err);
        setError(err.message);
      }
    };
  
    useEffect(() => {
      async function fetchMeetings() {
        try {
          const response = await fetch(
            `http://localhost:5000/api/calendar/meetings/?organizer_id=${organizerId}`
          );
          const result = await response.json();
          if (result.success) {
            setMeetings(result.data);
          } else {
            console.error("API Error:", result.error);
          }
        } catch (err) {
          console.error("Fetch error:", err);
        }
      }
  
      if (organizerId) {
        fetchMeetings();
      }
    }, [organizerId]);
  
    useEffect(() => {
      if (currentDate) fetchCalendarEvents();
    }, [currentDate]);
  
    const filteredEvents =
      activeTab === "meetings"
        ? meetings
        : events.filter((event) => event.event_type === activeTab.slice(0, -1)); // "birthdays" -> "birthday"
  
    const getColor = (type) => {
      switch (type) {
        case "holiday":
          return "bg-green-500";
        case "birthday":
          return "bg-pink-500";
        default:
          return "bg-blue-500"; // for meetings and others
      }
    };
  
    return (
      <div className="bg-white rounded-xl shadow p-4 w-full h-[310px] overflow-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-100">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold text-sm text-gray-800">Nearest Events</h2>
          <a
            href="#"
            className="text-xs flex gap-2 items-center text-blue-500 font-medium"
          >
            View all <img src={arrow} alt="arrow" />
          </a>
        </div>
  
        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {["meetings", "holidays", "birthdays"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-xs capitalize px-3 py-1 rounded-full ${
                activeTab === tab
                  ? "bg-blue-100 text-blue-600 font-semibold"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
  
        {/* Event list */}
        <div className="space-y-5">
          {filteredEvents.length === 0 ? (
            <p className="text-sm text-gray-400 text-center">
              No {activeTab} found
            </p>
          ) : (
            filteredEvents.map((event, idx) => (
              <div className="flex items-start gap-2" key={idx}>
                <div
                  className={`w-1 rounded-full h-[5rem] ${getColor(
                    event.event_type
                  )}`}
                />
                <div className="flex-1 mb-6">
                  <div className="text-sm mb-2 font-medium flex justify-between text-gray-900">
                    <div className="flex flex-col">
                      {event.title ||
                        (event.event_type === "birthday" &&
                          `${event.name || "Employee"}'s Birthday 🎉`)}
                    </div>
                    <ArrowIcon direction={event.arrow} />
                  </div>
                  <p className="text-[11px] font-medium">{event?.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500 mt-1 gap-2">
                    <span>
                      {event.end_date?.split("T")[0] ||
                        event.start_date?.split("T")[0]}
                    </span>
  
                    {activeTab === "meetings" && event.end_time && (
                      <span className="flex items-center gap-1 bg-[#F4F9FD] font-semibold rounded-[2px] p-2 px-3 text-[11px]">
                        <Clock size={12} /> {event.end_time} H
                      </span>
                    )}
  
                    {activeTab === "birthdays" && (
                      <span className="flex items-center gap-1 bg-[#F4F9FD] font-semibold rounded-[2px] p-2 px-3 text-[11px] text-pink-500">
                        <Gift size={12} /> Celebrate!
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };


const ProjectCard = ({ elem }) => {

    return (
        <div className="bg-white rounded-xl shadow-sm flex overflow-hidden w-full max-w-4xl mb-2">
            {/* Left Section */}
            <div className="flex-1 p-6 space-y-2">
                <div className='flex gap-3'>
                    <img src={elem?.photo_url} alt="projectimg" />
                    <div>
                        <p className="text-xs text-gray-400 ">PN0001265</p>
                        <p className="text-lg font-semibold text-gray-900">
                            {elem?.name}
                        </p>
                    </div>

                </div>
                <div className='flex justify-between'>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <CalendarDays className="w-4 h-4" />
                        Created {elem?.start_date.split("T")[0]}
                    </div>
                    <div className="text-yellow-500 font-medium flex items-center gap-1 text-sm">

                        <span className="text-base font-bold"><img src={priority} alt="priority" className='w-[10px] h-[15px]' /></span> {elem?.priority_level}
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