import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import addimg from "../../../assets/addimg.png"





export default function AddEmployeeModal({ onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    age:"",
    designation: "",
    level: "",
    email: "",
    identity_id: "",
    contact_number: "",
    password:"",
    house_address: "",
    date_of_birth: "",
    team_name: "",
    total_leave:0,
    sick_leave:0,
    vacation_leave:0,
    reporting_manager: "",
    father_name: "",
    mother_name: "",
    joining_date: "",
    current_project: "",
    appraisal_points:0,
    photo: null,
  });



  useEffect(() => {
    fetch('http://localhost:5000/api/leave-settings/active')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
          console.loh(data)
      })
      .catch((err) => {
       console.log(err.message);
       
      });
  }, []);


  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };





  const handleSubmit = async () => {
    const submitData = new FormData();
    for (let key in formData) {
      submitData.append(key, formData[key]);
    }
  
    try {
      const response = await fetch("http://localhost:5000/api/employees", {
        method: "POST",
        body: submitData,
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log("✅ Employee created:", data);
        alert("Employee created successfully!");
        onClose(false)
      } else {
        console.error("❌ Failed to create employee");
        alert("Failed to create employee");
      }
    } catch (error) {
      console.error("❌ Error submitting form:", error);
      alert("Something went wrong while submitting the form");
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
      <div className="bg-white w-[500px] p-6 rounded-2xl shadow-xl relative h-[400px] overflow-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-100">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black">
          <X size={20} />
        </button>

        {/* Title */}
        <h2 className="text-lg font-semibold mb-4">Add Employee</h2>

        {/* Illustration */}
        <div className="w-full flex justify-center mb-4">
          <img
            src={addimg} // replace with actual image path
            alt="Employee Illustration"
            className="rounded-xl w-full"
          />
        </div>



       
      <div className="grid grid-cols-2 gap-4  ">
        {[
          { label: "Employee Name", name: "name" },
          { label: "Designation", name: "designation" },
          { label: "Age", name: "age",type: "number"},
          { label: "Experience Level", name: "level" },
          { label: "Email", name: "email", type: "email" },
          { label: "Identity ID", name: "identity_id" },
          { label: "Contact Number", name: "contact_number" },
          { label: "House Address", name: "house_address" },
          { label: "Date of Birth", name: "date_of_birth", type: "date" },
          { label: "Team Name", name: "team_name" },
          { label: "total leave", name: "total_leave" },
          { label: "sick leave", name: "sick_leave" },
          { label: "vacation leave", name: "vacation_leave" },
          { label: "appraisal points", name: "appraisal_points" },
          { label: "Reporting Manager", name: "reporting_manager" },
          { label: "Father's Name", name: "father_name" },
          { label: "Mother's Name", name: "mother_name" },
          { label: "Joining Date", name: "joining_date", type: "date" },
          { label: "Current Project", name: "current_project" },
          {label:"Create Password",name:"password"}
        ].map((field) => (
          <div className="mb-4 w-[100%] " key={field.name}>
            <label className="text-[11px] font-medium text-[#7D8592] block mb-2">
              {field.label}
            </label>
            <input
              type={field.type || "text"}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              placeholder={field.label}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-[12px]"
            />
          </div>
        ))}

        {/* Upload Photo */}
        <div className="mb-4 ">
          <label className="text-[11px] font-medium text-[#7D8592] block mb-2">
            Upload Photo
          </label>
          <input
            type="file"
            name="photo"
            accept="image/*"
            onChange={handleChange}
            className="w-full text-[12px]"
          />
        </div>
      </div>

     
    






        {/* Add Another Member */}
        {/* <div className="text-blue-600 text-sm font-[400] cursor-pointer mb-4 flex items-center gap-1">
          <span className="text-lg">＋</span> Add another Member
        </div> */}

        {/* Approve Button */}
        <button className="float-right text-sm py-3 shadow-[0_2px_8px_0_#3F8CFF]
 bg-blue-600 w-[30%] text-white rounded-xl hover:bg-blue-700 transition" onClick={handleSubmit}>
          Approve
        </button>
      </div>
    </div>
  );
}
