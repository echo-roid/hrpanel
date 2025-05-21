import React, { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const res = await fetch('http://localhost:5000/api/list');
        const data = await res.json();
        if (res.ok) {
          setEmployees(data.employees || []);
        } else {
          throw new Error(data.error || 'Failed to fetch');
        }
      } catch (error) {
        console.error('Error fetching employee list:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchEmployees();
  }, []);

  const openModal = (employee) => {
    setSelectedEmployee(employee);
  };

  const closeModal = () => {
    setSelectedEmployee(null);
  };

  const formatDate = (dateStr) => {
    return dateStr ? new Date(dateStr).toLocaleDateString() : '-';
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white">
      <h2 className="text-3xl font-bold mb-6 text-center text-sky-600">Employee Directory</h2>

      {loading ? (
        <div className="text-center text-gray-500">Loading employees...</div>
      ) : employees.length === 0 ? (
        <div className="text-center text-gray-500">No employee records found.</div>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg shadow-md">
            <thead className="bg-sky-100 text-sky-600">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">PAN</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aadhar</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Blood Group</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-sky-50">
                  <td className="px-6 py-4 whitespace-nowrap">{emp.first_name} {emp.last_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{emp.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{emp.contact_number}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{emp.pan_number}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{emp.aadhar_number}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{emp.blood_group}</td>
                  <td className="px-6 py-4 text-center">
                    <button onClick={() => openModal(emp)} title="View Details" className="text-sky-500 hover:text-sky-700">
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-4xl relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
            >
              ✖
            </button>
            <h3 className="text-2xl font-semibold text-sky-600 mb-6">Employee Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
              <div className="space-y-2">
                <p><strong>Full Name:</strong> {selectedEmployee.title} {selectedEmployee.first_name} {selectedEmployee.last_name}</p>
                <p><strong>Email:</strong> {selectedEmployee.email}</p>
                <p><strong>Contact:</strong> {selectedEmployee.contact_number}</p>
                <p><strong>DOB:</strong> {formatDate(selectedEmployee.birth_date)}</p>
                <p><strong>Blood Group:</strong> {selectedEmployee.blood_group}</p>
                <p><strong>Father's Name:</strong> {selectedEmployee.father_name}</p>
                <p><strong>Mother's Name:</strong> {selectedEmployee.mother_name}</p>
                <p><strong>Address:</strong> {selectedEmployee.house_number}, {selectedEmployee.address}, {selectedEmployee.city}, {selectedEmployee.state}</p>
              </div>

              <div className="space-y-2">
                <p><strong>PAN:</strong> {selectedEmployee.pan_number}</p>
                {selectedEmployee.pan_document_path && (
                  <p><strong>PAN Document:</strong> <a href={selectedEmployee.pan_document_path} className="text-sky-500 underline" target="_blank">View</a></p>
                )}
                <p><strong>Aadhar:</strong> {selectedEmployee.aadhar_number}</p>
                {selectedEmployee.aadhar_front_path && (
                  <p><strong>Aadhar Front:</strong> <a href={selectedEmployee.aadhar_front_path} className="text-sky-500 underline" target="_blank">View</a></p>
                )}
                {selectedEmployee.aadhar_back_path && (
                  <p><strong>Aadhar Back:</strong> <a href={selectedEmployee.aadhar_back_path} className="text-sky-500 underline" target="_blank">View</a></p>
                )}
                <p><strong>Bank Account:</strong> {selectedEmployee.bank_account_name} - {selectedEmployee.bank_account_number}</p>
                <p><strong>IFSC:</strong> {selectedEmployee.bank_ifsc}</p>
                <p><strong>Branch:</strong> {selectedEmployee.bank_branch}</p>
                {selectedEmployee.cancel_cheque_path && (
                  <p><strong>Cancelled Cheque:</strong> <a href={selectedEmployee.cancel_cheque_path} className="text-sky-500 underline" target="_blank">View</a></p>
                )}
              </div>

              {/* Passport Details */}
              <div className="col-span-2 mt-6">
                <h4 className="text-lg font-semibold text-sky-600 mb-4">Passport Details</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <p><strong>Passport Number:</strong> {selectedEmployee.passport_number}</p>
                  <p><strong>Nationality:</strong> {selectedEmployee.passport_nationality}</p>
                  <p><strong>Place of Birth:</strong> {selectedEmployee.passport_place_of_birth}</p>
                  <p><strong>Date of Birth:</strong> {formatDate(selectedEmployee.passport_dob)}</p>
                  <p><strong>Issue Date:</strong> {formatDate(selectedEmployee.passport_issue_date)}</p>
                  <p><strong>Expiry Date:</strong> {formatDate(selectedEmployee.passport_expire_date)}</p>
                  <p><strong>Place of Issue:</strong> {selectedEmployee.passport_place_of_issue}</p>
                  <p><strong>Sex:</strong> {selectedEmployee.passport_sex}</p>
                  <p><strong>Father's Name:</strong> {selectedEmployee.passport_father_name}</p>
                  <p><strong>Mother's Name:</strong> {selectedEmployee.passport_mother_name}</p>
                </div>
              </div>

              {/* Emergency Contacts */}
              {selectedEmployee.emergencyContacts?.length > 0 && (
                <div className="col-span-2 mt-6">
                  <h4 className="text-lg font-semibold text-sky-600 mb-4">Emergency Contacts</h4>
                  <ul className="list-disc ml-6 space-y-1 text-sm">
                    {selectedEmployee.emergencyContacts.map((c) => (
                      <li key={c.id}><strong>{c.name}</strong> ({c.relation}) - {c.phone}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
