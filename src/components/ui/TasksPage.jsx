import React, { useEffect, useState } from "react";
import filter from "../../assets/filter.png"
import progress from "../../assets/progress.png"
import { Plus } from "lucide-react";
import Addproject from "./modals/Addproject";
import { useDispatch, useSelector } from 'react-redux';
import Addtask from "./modals/Addtask";

import { fetchProjects } from "../../redux/slices/projectSlice";



export default function TasksPage() {
  const selectedProjectId = useSelector((state) => state.projectSelection.selectedProjectId);
  const [selectedId, setSelectedId] = useState(null);
  const [tsaskData, setTaskData] = useState(null);
  const dispatch = useDispatch();
  const { projectList, status, error } = useSelector((state) => state.projects);



  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);


  const fetchTasks = async (projectId) => {
    const response = await fetch(`http://localhost:5000/api/tasks?project_id=${projectId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  
    if (!response.ok) {
      throw new Error("Failed to fetch tasks");
    }
  
    const data = await response.json();
    setTaskData(data.data); // or whatever structure your backend returns
  };
  
  


  return (
    <>
      <h2 className="text-2xl font-bold mb-5  text-[36px]">Projects</h2>
      <div className="flex bg-[#f6f9fe] min-h-screen">

        {/* Sidebar */}
        <div className="w-[20%] bg-white rounded-xl shadow-md my-4 p-4 h-[500px] overflow-auto  scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-100">
          <h2 className="text-sm font-semibold mb-4 text-gray-500">Current Projects</h2>

          {projectList?.map((project,index) => (
        <div
          key={index}
          onClick={() => {
            setSelectedId(project?.id);
            fetchTasks(project?.id);
          }}
          className={`cursor-pointer p-3 rounded-lg mb-3 ${
            selectedId === project.id ? "bg-blue-100 border border-blue-500" : "bg-[#f1f7ff]"
          }`}
        >
          
          <p className="text-sm font-semibold mb-1">{project.name || "Unnamed Project"}</p>
          <p className="text-xs text-gray-400 mb-3">{project.description || "PN0001245"}</p>
          <button className="text-sm text-blue-500 mt-1">View details &rarr;</button>
        </div>
      ))}
          
          
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4">


          <div className=" p-4  ">
            <div className="flex justify-between mb-4 items-center">
              <h1 className="text-xl font-semibold ">Tasks</h1>
              <div className="flex gap-3">
                <img src={filter} alt="not found" className="shadow-sm w-10 h-10 bg-white p-3 rounded-xl" />
                <button className="bg-[#3F8CFF]  text-sm text-white rounded-lg px-4 py-2 flex items-center gap-1 shadow-md" onClick={() => { setOpen(true) }}>
                  <Plus size={16} /> Add Project
                </button>

                {
                  selectedProjectId && <button className="bg-[#3F8CFF]  text-sm text-white rounded-lg px-4 py-2 flex items-center gap-1 shadow-md" onClick={() => { setOpen2(true) }}>
                    <Plus size={16} /> Add Taks
                  </button>
                }

              </div>

            </div>

            <h2 className="text-sm font-semibold mb-4 py-3 rounded-[20px]  bg-[#E6EDF5]  text-center">Active Tasks</h2>
              <div className="space-y-4">
                {tsaskData?.map((task, index) => (
                  <div
                    key={index}
                    className="bg-white shadow-sm rounded-xl px-4 py-4 flex justify-between items-center "
                  >
                    <div className=" text-[10px] w-1/4">
                      <p className="text-gray-500">Task Name</p>
                      <p className="font-semibold text-gray-800">{task.title}</p>
                    </div>
                    <div className="text-[10px] text-gray-500 w-1/5">
                      <p>Description</p>
                      <p className="font-medium text-black">{task.description}</p>
                    </div>
                    <div className="text-[10px] text-gray-500 w-1/5">
                      <p>Priority Level</p>
                      <div className="flex gap-2">
                      <p className="font-medium text-black">{task.priority_level}</p>
                      ↑
                      </div>
                     
                    </div>
                    <div className="text-[10px] text-gray-500 w-1/5">
                      <p>Status</p>
                      <p className="font-medium text-black">{task.status}</p>
                    </div>


                    <div className="text-[10px] text-gray-500 w-1/5">
                      <p>Start Date</p>
                      <p className="font-medium text-black">{task.start_date.split("T")[0]}</p>
                    </div>

                    <div className="text-[10px] text-gray-500 w-1/5">
                      <p>Due start</p>
                      <p className="font-medium text-black">{task.due_date.split("T")[0]}</p>
                    </div>
                   
                    

                  </div>
                ))}
              </div>
          </div>
        </div>
      </div>

      {open && <Addproject onClose={() => setOpen(false)} />}
      {open2 && <Addtask onClose={() => setOpen2(false)} />}
    </>

  );
}
