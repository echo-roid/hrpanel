import React, { useEffect, useState } from "react";
// import Threedot from "../../assets/dot.png"
import { ChevronLeft, ChevronRight, Plus ,Trash} from "lucide-react";
import filter from "../../assets/filter.png"
import AddEmployeeModal from "./modals/AddEmployeeModal";
import { useDispatch, useSelector } from "react-redux";
import  {fetchEmployees}  from "../../redux/slices/employeeSlice";
import { Link } from "react-router-dom";


export default function EmployeeList() {
    const [tab, setTab] = useState("Days");
    const [open, setOpen] = useState(false);
   
    const dispatch = useDispatch();
    const employees = useSelector((state) => state.employee.list);
    const status = useSelector((state) => state.employee.status);
    const error = useSelector((state) => state.employee.error);
  
    useEffect(() => {
      if (status === "idle") {
        dispatch(fetchEmployees());
      }
    }, [status, dispatch]);
  
    if (status === "loading") return <p>Loading employees...</p>;
    if (status === "failed") return <p>Error: {error}</p>;
  

    return (
        <>
            <div className="min-h-[300px]  py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold">Employees ({employees.length})</h1>
                    <div className="flex w-[250px]  bg-[#E6EDF5] rounded-full p-1 shadow">
                        {["List", "Activity"].map((label) => (
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
                        <img src={filter} alt="filter" className="bg-white rounded-lg p-2 shadow" />
                        <button className="bg-[#3F8CFF] text-sm text-white rounded-lg px-4 py-2 flex items-center gap-1 shadow-md" onClick={() => { setOpen(true) }}>
                            <Plus size={16} /> Add Employee
                        </button>
                    </div>
                </div>
                <div className="space-y-4">
                    {employees?.map((elem, index) => (
                        <div
                            key={index}
                            className="bg-white shadow-sm rounded-xl px-4 py-4 grid grid-cols-6 gap-4 items-center text-xs"
                        >
                            {/* Name + Photo */}
                            <div className="col-span-1">
                                <p className="text-gray-500">Name</p>
                                <div className="flex gap-2 items-center mt-1">
                                    <img
                                        src={elem?.photo}
                                        alt="profile"
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                    <p className="font-semibold text-gray-800">
                                    <Link to={`/Employees/${elem.id}`}> {elem.name.length > 7 ? `${elem.name.slice(0, 7)}...` : elem.name}</Link>
                                       
                                    </p>
                                </div>
                            </div>

                            {/* Designation */}
                            <div>
                                <p className="text-gray-500">Designation</p>
                                <p className="font-medium text-black mt-1">
                                        {elem.designation.length > 7
                                            ? `${elem.designation.slice(0, 7)}...`
                                            : elem.designation}
                                </p>
                            </div>

                            {/* Level */}
                            <div>
                                <p className="text-gray-500">Experience Level</p>
                                <p className="font-medium text-black mt-1">{elem.level}</p>
                            </div>

                            {/* Email */}
                            <div>
                                <p className="text-gray-500">Email</p>
                                <p className="font-medium text-black mt-1">
                                    {elem.email.length > 7 ? `${elem.email.slice(0, 7)}...` : elem.email}
                                </p>
                            </div>

                            {/* Contact Number */}
                            <div>
                                <p className="text-gray-500">Contact Number</p>
                                <p className="font-medium text-black mt-1">{elem.contact_number}</p>
                            </div>

                            {/* Joining Date */}
                            <div>
                                <p className="text-gray-500">Joining Date</p>
                                <p className="font-medium text-black mt-1">{elem.joining_date}</p>
                            </div>
                        </div>
                    ))}
                </div>



            </div>
            <div className="flex items-center justify-center gap-3 px-4 py-2 w-[150px] rounded-lg bg-white shadow-md text-sm font-medium text-gray-800">
                <span>{`${1}-${8} of ${28}`}</span>
                <ChevronLeft className="h-4 w-4 text-gray-300 cursor-not-allowed" />
                <ChevronRight className="h-4 w-4 text-blue-500 cursor-pointer hover:scale-105 transition" />
            </div>



            {open && <AddEmployeeModal onClose={() => setOpen(false)} />}
        </>
    );
}
