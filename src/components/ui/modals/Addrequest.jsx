import React, { useEffect, useState } from 'react';
import addimg from "../../../assets/addimg.png";
import { useSelector } from 'react-redux';
import Select from 'react-select';



const CustomOption = (props) => {
  const { data, innerRef, innerProps } = props;
  return (
    <div ref={innerRef} {...innerProps} className="flex items-center p-2 hover:bg-gray-100 cursor-pointer">
      <img src={data.photo} alt={data.label} className="w-8 h-8 rounded-full mr-2" />
      <span>{data.label}</span>
    </div>
  );
};



const CustomSingleValue = ({ data }) => (
  <div className="flex items-center">
    <img src={data.photo} alt={data.label} className="w-6 h-6 rounded-full mr-2" />
    <span>{data.label}</span>
  </div>
);


const Addrequest = ({ onClose, employeeId }) => {
  const [formData, setFormData] = useState({
    leave_type_id: '',
    start_date: '',
    end_date: '',
    reason: '',
    medical_certificate: '',
    contact: '',
    managerId: ''
  });


  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [managers, setManagers] = useState([]);

  const user = useSelector(state => state.auth.user);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => {
      let updatedForm = { ...prev, [name]: value };

      // If leave_type_id changes and is not 2, clear medical_certificate
      if (name === 'leave_type_id' && value !== '2') {
        updatedForm.medical_certificate = '';
      }

      return updatedForm;
    });
  };




  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/employees/allmanagers'); // Adjust URL if needed
        if (!response.ok) {
          throw new Error('Failed to fetch managers');
        }

        const data = await response.json();
        setManagers(data);
      } catch (error) {
        console.error('Error fetching managers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchManagers();
  }, []);




  const managerOptions = managers.map(manager => ({
    value: manager.id,
    label: manager.name,
    photo: manager.photo // assuming this is the filename or URL
  }));






  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:5000/api/leave/${user?.employee.id}/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to submit request');

      const result = await response.json();
      //   console.log('Success:', result);

      setSuccessMessage('Request submitted successfully!');
      setFormData({
        leave_type_id: '',
        start_date: '',
        end_date: '',
        reason: '',
        medical_certificate: '',
        contact: '',
        managerId: ''
      });

      onClose()

    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Failed to submit request.');
    }
    setLoading(false);
  };



  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl relative max-h-[90vh] overflow-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-100">

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl"
          >
            &times;
          </button>

          {/* Image */}
          <div className="w-full flex justify-center mb-4">
            <img src={addimg} alt="Add Event" className="rounded-xl w-full" />
          </div>

          {/* Header */}
          <h2 className="text-lg font-semibold mb-4">Add Leave Request</h2>

          {/* Messages */}
          {successMessage && <p className="text-green-600">{successMessage}</p>}
          {errorMessage && <p className="text-red-600">{errorMessage}</p>}

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>

            {/* Leave Type */}
            <div>
              <label className="text-sm font-medium">Leave Type ID</label>
              <input
                type="text"
                name="leave_type_id"
                placeholder="Enter Leave Type ID"
                value={formData.leave_type_id}
                onChange={handleChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            {/* Start and End Date */}
            <div className="flex space-x-2">
              <div className="flex-1">
                <label className="text-sm font-medium">Start Date</label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium">End Date</label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Reporting Manager</label>
              <Select
                options={managerOptions}
                placeholder="Select a Manager"
                components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
                onChange={selectedOption => {
                  setFormData(prev => ({
                    ...prev,
                    managerId: selectedOption.value
                  }));
                }}
                className="mt-1"
              />
            </div>

            {/* Reason */}
            <div>
              <label className="text-sm font-medium">Reason</label>
              <textarea
                name="reason"
                rows="3"
                placeholder="Enter reason for leave"
                value={formData.reason}
                onChange={handleChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md resize-none"
                required
              ></textarea>
            </div>

            {/* Medical Certificate (Optional) */}
            {formData.leave_type_id === '2' && (
              <div>
                <label className="text-sm font-medium">Medical Certificate (optional)</label>
                <input
                  type="text"
                  name="medical_certificate"
                  placeholder="Certificate URL or ID"
                  value={formData.medical_certificate}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                />
              </div>
            )}

            {/* Contact During Leave */}
            <div>
              <label className="text-sm font-medium">Contact During Leave</label>
              <input
                type="text"
                name="contact"
                placeholder="Your contact number"
                value={formData.contact}
                onChange={handleChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            {/* Repeat Event Checkbox */}


            {/* Save Button */}
            <div className="text-right">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow disabled:bg-blue-300"
              >
                {loading ? 'Saving...' : 'Save Request'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </>
  );
};

export default Addrequest;
