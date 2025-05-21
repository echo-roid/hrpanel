import React, { useEffect, useState } from 'react';
import { Bell, Eye } from "lucide-react";
import { useSelector } from 'react-redux';

const ReimbursementList = () => {
  const user = useSelector((state) => state.auth.user);
  const Myid = user?.employee?.id;

  const [reimbursements, setReimbursements] = useState([]);
  const [allReimbursements, setAllReimbursements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMyApprovals, setShowMyApprovals] = useState(false);
  const [selectedReimbursement, setSelectedReimbursement] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const url = user?.employee?.designation === "Manager"
          ? 'http://localhost:5000/api/reimbursements'
          : `http://localhost:5000/api/reimbursements/rei/${Myid}`;

        const res = await fetch(url);
        const data = await res.json();

        if (res.ok) {
          setReimbursements(data);
          setAllReimbursements(data);
        } else {
          throw new Error(data.error);
        }
      } catch (error) {
        console.error('Fetch reimbursements error:', error);
      } finally {
        setLoading(false);
      }
    }

    if (user) fetchData();
  }, [Myid, user]);

  const getStatusBadge = (status) => {
    const base = "px-3 py-1 rounded-full text-sm font-semibold";
    switch (status?.toLowerCase()) {
      case 'approved': return `${base} bg-green-100 text-green-700`;
      case 'pending': return `${base} bg-yellow-100 text-yellow-700`;
      case 'rejected': return `${base} bg-red-100 text-red-700`;
      default: return `${base} bg-gray-100 text-gray-700`;
    }
  };

  const toggleMyApprovals = () => {
    if (showMyApprovals) {
      setReimbursements(allReimbursements.filter(r => r.manager_id === Myid));
    } else {
      setReimbursements(allReimbursements.filter(r => r.team_name === user?.employee?.team_name));
    }
    setShowMyApprovals(!showMyApprovals);
  };

  const getTotalAmount = (invoices = []) =>
    invoices.reduce((sum, inv) => sum + parseFloat(inv.amount || 0), 0);

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-semibold text-center text-sky-600 mb-6 flex gap-2 items-center justify-center">
        Reimbursement Requests
        {user?.employee?.designation === "Manager" && (
          <Bell
            className={`w-6 h-6 cursor-pointer transition ${showMyApprovals ? "text-blue-600" : "text-gray-500"}`}
            onClick={toggleMyApprovals}
            title="Toggle My Approvals"
          />
        )}
      </h2>

      {loading ? (
        <div className="text-center text-gray-500">Loading reimbursements...</div>
      ) : reimbursements.length === 0 ? (
        <div className="text-center text-gray-500">No reimbursements found.</div>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg">
            <thead className="bg-sky-100 text-sky-600">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#Invoices</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Approver</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reimbursements.map((r) => (
                <tr key={r.id} className="hover:bg-sky-50 transition-all">
                  <td className="px-6 py-4 whitespace-nowrap">{r.employee_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">₹{getTotalAmount(r.invoices)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{r.invoices?.length || 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getStatusBadge(r.status)}>{r.status}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{r.approver_name || '-'}</td>
                  <td className="px-6 py-4 text-center">
                    <button onClick={() => setSelectedReimbursement(r)} title="View Details">
                      <Eye className="w-5 h-5 text-gray-600 hover:text-sky-600 transition-all" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {selectedReimbursement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-3xl relative">
            <button
              onClick={() => setSelectedReimbursement(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
            >
              ✖
            </button>
            <h3 className="text-2xl font-semibold mb-6 text-sky-600">Reimbursement Details</h3>

            <div className="mb-4 space-y-2 text-sm">
              <p><strong>Employee:</strong> {selectedReimbursement.employee_name}</p>
              <p><strong>Status:</strong> {selectedReimbursement.status}</p>
              <p><strong>Submission Date:</strong> {selectedReimbursement.submission_date}</p>
              <p><strong>Approver:</strong> {selectedReimbursement.approver_name || '-'}</p>
              <p><strong>Total Amount:</strong> ₹{getTotalAmount(selectedReimbursement.invoices)}</p>
            </div>

            <hr className="my-6" />
            <h4 className="text-lg font-semibold mb-4 text-sky-600">Invoices</h4>
            <div className="space-y-6 max-h-60 overflow-auto">
              {selectedReimbursement.invoices?.map((inv, idx) => (
                <div key={idx} className="border p-4 rounded-lg shadow-sm bg-gray-50 text-sm">
                  <p><strong>Amount:</strong> ₹{inv.amount}</p>
                  <p><strong>Category:</strong> {inv.category}</p>
                  <p><strong>Description:</strong> {inv.description || '-'}</p>
                  {inv.travel_type && (
                    <>
                      <p><strong>Travel Type:</strong> {inv.travel_type}</p>
                      {inv.travel_type === 'own' && (
                        <>
                          <p><strong>Location:</strong> {inv.location}</p>
                          <p><strong>Kilometers:</strong> {inv.kilometers}</p>
                        </>
                      )}
                    </>
                  )}
                  {inv.receipt_url && (
                    <p>
                      <strong>Receipt:</strong>{' '}
                      <a href={inv.receipt_url} target="_blank" rel="noopener noreferrer" className="text-sky-600 underline">
                        View Receipt
                      </a>
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReimbursementList;
