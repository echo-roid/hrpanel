import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { ArrowLeft  } from "lucide-react";
import { useNavigate } from 'react-router-dom';


export default function LeaveNotification() {

    const navigate = useNavigate();
      const [notificationLeaveData, setNotificationLeaveData] = useState([]);

        const [loading, setLoading] = useState(false);
      
        
  const user = useSelector((state) => state.auth.user);
        //  const [loading, setLoading] = useState(true);
        const [error, setError] = useState('');
    useEffect(() => {
       
          const fetchNotifications = async () => {
            try {
              const response = await fetch(
                `http://localhost:5000/api/leave/notifications/${user.employee.id}`
              );
              if (!response.ok) {
                throw new Error('Failed to fetch leave notifications');
              }
    
              const data = await response.json();
              setNotificationLeaveData(data?.data);
            } catch (error) {
              console.error('Error fetching leave notifications:', error);
            } finally {
              setLoading(false);
            }
          };
    
          fetchNotifications();
        
      }, []); // 👈 added dependency
    

      const handleApprove = async (managerId, requestId) => {
        setLoading(true);
        setError(null);
    
        try {
          const response = await fetch(`http://localhost:5000/api/leave/${requestId}/approve`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              managerId,
              comments: 'Approved by manager',
            }),
          });
    
          const data = await response.json();
    
          if (response.ok) {
            alert(data.message); // or use a toast
    
          } else {
            setError(data.error || 'Something went wrong');
          }
        } catch (err) {
          setError('Network error');
        } finally {
          setLoading(false);
        }
      };
    
    
    
      const handleReject = async (managerId, requestId) => {
        setLoading(true);
        setError(null);
    
        try {
          const response = await fetch(`http://localhost:5000/api/leave/${requestId}/reject`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              managerId,
              comments: 'Reject by manager',
            }),
          });
    
          const data = await response.json();
    
          if (response.ok) {
            alert(data.message); // or use a toast
    
          } else {
            setError(data.error || 'Something went wrong');
          }
        } catch (err) {
          setError('Network error');
        } finally {
          setLoading(false);
        }
      };
  return (
    <div>
            {notificationLeaveData.length !=0 ? notificationLeaveData?.map((emp, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl px-6 py-4 shadow-sm flex flex-col gap-4"
                >
                  {/* Header Row: Image and Info */}
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

                  {/* Message and Buttons */}
                  <div className=" text-sm text-gray-700">
                    <div className="mb-5">
                      <div className="text-xs text-gray-400">Message</div>
                      <div className="text-[12px] font-semibold">{emp?.message}</div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <button
                          className="bg-[#3F8CFF] text-white rounded-lg px-4 py-2 text-sm shadow-md w-full"
                          onClick={() => handleApprove(emp?.manager_id, emp?.request_id)}
                        >
                          Approve
                        </button>
                      </div>
                      <div>
                        <button
                          className="bg-[#3F8CFF] text-white rounded-lg px-4 py-2 text-sm shadow-md w-full"
                          onClick={() => handleReject(emp?.manager_id, emp?.request_id)}
                        >
                          Reject
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              )):<div className='flex justify-between w-[60%] items-center'><ArrowLeft size={20}  onClick={() => navigate(-1)}/> <h1 className=' text-lg font-medium'>Zero Leave Request</h1></div> }
    </div>
            
  )
}
