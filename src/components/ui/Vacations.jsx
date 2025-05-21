import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import React, { useState, useMemo, useEffect } from "react";
import filter from "../../assets/filter.png"
import activeArrow from "../../assets/activearrow.png"
import unactiveArrow from "../../assets/unactivearrow.png"
import serachbar from "../../assets/searchbar.png"
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import weekday from "dayjs/plugin/weekday";
import isoWeek from "dayjs/plugin/isoWeek";
import isLeapYear from "dayjs/plugin/isLeapYear"
import Addrequest from "./modals/Addrequest";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from '../../redux/slices/authSlice';
import { Link } from 'react-router-dom';
// const employees = [
//     {
//       name: "Ryan Thompson",
//       email: "ryanthom@gmail.com",
//       image: "https://i.pravatar.cc/100?img=1",
//       vacations: 15,
//       sickLeave: 3,
//       remote: 50,
//     },
//     {
//       name: "Vincent Allen",
//       email: "vincentall@gmail.com",
//       image: "https://i.pravatar.cc/100?img=2",
//       vacations: 10,
//       sickLeave: 6,
//       remote: 34,
//     },
//     {
//       name: "Grace Joseph",
//       email: "gracejos@gmail.com",
//       image: "https://i.pravatar.cc/100?img=3",
//       vacations: 10,
//       sickLeave: 5,
//       remote: 19,
//     },
//     {
//       name: "Emily Tyler",
//       email: "tyleremily24@gmail.com",
//       image: "https://i.pravatar.cc/100?img=4",
//       vacations: 8,
//       sickLeave: 7,
//       remote: 41,
//     },
//     {
//       name: "Lenora Fowler",
//       email: "eravi@ec.gov",
//       image: "https://i.pravatar.cc/100?img=5",
//       vacations: 14,
//       sickLeave: 4,
//       remote: 38,
//     },
//     {
//       name: "Maude Goodman",
//       email: "maudegood@gmail.com",
//       image: "https://i.pravatar.cc/100?img=6",
//       vacations: 12,
//       sickLeave: 6,
//       remote: 45,
//     },
//   ];





export default function EmployeeLeaveTable() {
  const [tab, setTab] = useState("Emp'vacations");
  const [isOpen, setIsOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [leaveData, setLeaveData] = useState(null);
  //  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const user = useSelector((state) => state.auth.user);



   async function getLeavesInDateRange(start, end) {
    const response = await fetch(`http://localhost:5000/api/leave?start_date=${start}&end_date=${end}`);
    const data = await response.json();
    return data;
  }

  useEffect(() => {
    user?.employee?.designation =="HR" &&  (
    getLeavesInDateRange("2025-01-01","2025-12-01").then(result => {
      if (result.success) {
        setLeaveData(result.data); // Do something with the leave data
      }
      
    }));
  }, []);


 
  useEffect(() => {
    async function fetchLeaveStatusList() {
      try {
        const res = await fetch(`http://localhost:5000/api/leave?team_name=${user?.employee?.team_name}`);
        const result = await res.json();
        if (result.success) {
          setLeaveData(result.data);
          // render in UI
        } else {
          console.error('Server Error:', result.error);
        }
      } catch (err) {
        console.error('Network Error:', err);
      }
    }
    user?.employee?.designation !== "HR" && fetchLeaveStatusList()
    
  }, [])


  const CancelLeave = async (employeeId, requestId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:5000/api/leave/${requestId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employeeId,
          reason: 'Leave canceled because it is past the start date',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // alert(data.message);
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!leaveData) return;
  

    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    leaveData.forEach((emp) => {
      if (!emp.start_date || !['pending', 'rejected'].includes(emp.status)) return;
  
      const leaveStartDate = new Date(emp.start_date);
      leaveStartDate.setHours(0, 0, 0, 0);
  
      if (leaveStartDate < today) {
        CancelLeave(emp.employee_id, emp.requestId); // Make sure emp.id is the request ID
      }
    });
  }, [leaveData]);
  // Check if leave start_date is in the past







  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Vacations</h1>
        <div className="flex w-[300px]  bg-[#E6EDF5] rounded-full p-1 shadow">
          {["Emp'vacations", "Calendar"].map((label) => (
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
        <div className="flex gap-2 items-center">
          {
            user?.employee?.designation == "Manager" ?   <Link to={"/LeaveNotification"}> <img src={filter} alt="filter" className="bg-white w-9 h-9 rounded-lg p-2 shadow" /></Link>: null
          }
      
         
          <button className="bg-[#3F8CFF] text-sm text-white rounded-lg px-4 py-2 flex items-center gap-1 shadow-md" onClick={() => setIsOpen(true)}>
            <Plus size={16} /> Add Request
          </button>
        </div>
      </div>



      {
        tab === "Emp'vacations" ?

          <div className="w-full py-4 ">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {leaveData?.map((emp, idx) => (

                <div
                  key={idx}
                  className="flex justify-between items-center bg-white rounded-xl px-6 py-4 mb-3 shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={emp?.employee_photo}
                      alt={emp?.employee_name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{emp?.employee_name}</div>
                      <div className="text-sm text-gray-500">{emp?.employee_designation}</div>
                    </div>
                  </div>
                  <div className="flex align-baseline gap-5 text-sm text-gray-700">
                    <div className="">
                      <div className="text-xs  text-gray-400">Leave Type</div>
                      <div className="text-[12px] font-semibold">{emp?.leave_type}</div>
                    </div>
                    <div>
                      <div className="text-xs  text-gray-400"> Days Requested</div>
                      <div className="text-[12px] font-semibold">{emp?.days_requested} Days</div>

                    </div>
                    <div className="">
                      <div className="text-xs  text-gray-400">Status</div>
                      <div className="text-[12px] font-semibold">{emp?.status}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div> :

          <ScheduleGrid  leaveData={leaveData}/>

      }

      {
        isOpen && <Addrequest onClose={() => setIsOpen(false)} />
      }

    </>

  );
}
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter); 
dayjs.extend(isoWeek);
dayjs.extend(weekday);

// Customize color based on status
const getStatusColor = (status) => {
  switch (status) {
    case "sick-approved":
      return "bg-red-500";
    case "sick-pending":
      return "border border-red-400";
    case "remote-approved":
      return "bg-purple-600";
    case "remote-pending":
      return "border border-purple-400";
    case "vacation-approved":
      return "bg-cyan-400";
    case "vacation-pending":
      return "border border-cyan-400";
    case "cancelled":
      return "bg-red-200 border border-red-500";
    default:
      return "";
  }
};

function ScheduleGrid({ leaveData }) {
  const [currentMonth, setCurrentMonth] = useState(dayjs());

  const handlePrev = () => setCurrentMonth((prev) => prev.subtract(1, "month"));
  const handleNext = () => setCurrentMonth((prev) => prev.add(1, "month"));

  const days = useMemo(() => {
    const daysInMonth = currentMonth.daysInMonth();
    return Array.from({ length: daysInMonth }, (_, i) => {
      const date = currentMonth.date(i + 1);
      return {
        day: date.date(),
        weekday: date.format("ddd"),
        date,
      };
    });
  }, [currentMonth]);

  const getLeaveStatusForDay = (empId, date) => {
    const todayStr = date.format("YYYY-MM-DD");

    const entry = leaveData.find((leave) => {
      if (leave.employee_id !== empId) return false;

      const start = dayjs(leave.start_date);
      const end = dayjs(leave.end_date);

      return date.isSameOrBefore(end, "day") && date.isSameOrAfter(start, "day");
    });

    if (!entry) return "";

    if (entry.status === "cancelled") return "cancelled";

    const leaveType = entry.leave_type.toLowerCase().includes("sick")
      ? "sick"
      : entry.leave_type.toLowerCase().includes("remote")
      ? "remote"
      : "vacation";

    return `${leaveType}-${entry.status.toLowerCase()}`;
  };

  const employees = useMemo(() => {
    const uniqueMap = {};
    leaveData.forEach((entry) => {
      if (!uniqueMap[entry.employee_id]) {
        uniqueMap[entry.employee_id] = {
          employee_id: entry.employee_id,
          employee_name: entry.employee_name,
          employee_photo: entry.employee_photo,
        };
      }
    });
    return Object.values(uniqueMap);
  }, [leaveData]);

  return (
    <div className="bg-[#f6fafd] min-h-screen">
      <div className="bg-white rounded-2xl shadow overflow-auto">
        <div className="text-xl flex items-center justify-center gap-3 font-semibold mt-5">
          <p className="text-center">{currentMonth.format("MMMM YYYY")}</p>
          <div className="flex gap-3 items-center">
            <button onClick={handlePrev}>&larr;</button>
            <button onClick={handleNext}>&rarr;</button>
          </div>
        </div>

        <div className="grid" style={{ gridTemplateColumns: `200px repeat(${days.length}, 1fr)` }}>
          <div className="font-semibold flex items-center justify-between px-3 border-r p-3 mt-[-41px]">
            <p className="text-sm font-bold">Employees</p>
            <div className="w-7 h-7 bg-gray-300 rounded-full"></div>
          </div>

          {days.map(({ day, weekday }, index) => (
            <div
              key={index}
              className="text-center rounded-tl-lg rounded-tr-lg text-sm bg-[#F4F9FD] p-2 text-gray-600 border-b "
            >
              <div className="text-[10px] font-semibold">{weekday}</div>
              <div>{day}</div>
            </div>
          ))}

          {employees.map((emp, rowIndex) => (
            <React.Fragment key={rowIndex}>
              <div className="flex items-center p-3 py-2 gap-2 font-medium border-t border-r">
                <img
                  src={emp.employee_photo}
                  className="w-8 h-8 rounded-full bg-gray-300"
                  alt=""
                />
                <p className="text-[12px]">{emp.employee_name}</p>
              </div>
              {days.map(({ date }) => {
                const status = getLeaveStatusForDay(emp.employee_id, date);
                return (
                  <div
                    key={date}
                    className={`w-7 h-9 bg-[#F4F9FD] mt-2 rounded-md ${getStatusColor(status)}`}
                  ></div>
                );
              })}
            </React.Fragment>
          ))}
        </div>

        <div className="text-[12px] flex flex-wrap gap-4 items-center border-l p-4 w-full border-t">
          {/* <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span>Sick Leave - Approved</span>
          </div> */}
          {/* <div className="flex items-center gap-2">
            <div className="w-4 h-4 border border-red-400 rounded-full"></div>
            <span>Sick Leave - Pending</span>
          </div> */}
          {/* <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-600 rounded-full"></div>
            <span>Remote - Approved</span>
          </div> */}
          {/* <div className="flex items-center gap-2">
            <div className="w-4 h-4 border border-purple-400 rounded-full"></div>
            <span>Remote - Pending</span>
          </div> */}
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-cyan-400 rounded-full"></div>
            <span>Vacation - Approved</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border border-cyan-400 rounded-full"></div>
            <span>Vacation - Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-200 border border-red-500 rounded-full"></div>
            <span>Cancelled</span>
          </div>
        </div>
      </div>
    </div>
  );
}