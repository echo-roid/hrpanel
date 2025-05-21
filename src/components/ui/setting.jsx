import React, { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

const leaveTypesDefault = [
  'Sick Leave',
  'Casual Leave',
  'Earned Leave',
  'Maternity Leave',
  'Paternity Leave',
  'Compensatory Leave',
];

const AdminSettings = () => {
  const [selectedLeaves, setSelectedLeaves] = useState([]);
  const [leaveStatus, setLeaveStatus] = useState({});
  const [workingHours, setWorkingHours] = useState(8);
  const [workingDays, setWorkingDays] = useState(5);
  const [customLeaveName, setCustomLeaveName] = useState('');
  const [customLeaves, setCustomLeaves] = useState([]);
  const [leaveQuotas, setLeaveQuotas] = useState({});
  const [loading, setLoading] = useState(true);

  const allLeaveTypes = [...leaveTypesDefault, ...customLeaves];

 
    const fetchSettings = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/leave-settings');
        const data = await response.json();

        setWorkingHours(data.workingHours || 8);
        setWorkingDays(data.workingDays || 5);
        setLeaveStatus(data.leaveStatus || {});
        setLeaveQuotas(data.leaveQuotas || {});
        setCustomLeaves(data.customLeaves || []);
        setSelectedLeaves(data.selectedLeaves || []);
      } catch (err) {
        console.error('Failed to load settings:', err);
      } finally {
        setLoading(false);
      }
    };


  const handleLeaveToggle = (type) => {
    const updatedStatus = { ...leaveStatus, [type]: !leaveStatus[type] };
    setLeaveStatus(updatedStatus);

    if (!updatedStatus[type]) {
      setSelectedLeaves(prev => prev.filter(l => l !== type));
    } else {
      setSelectedLeaves(prev => [...new Set([...prev, type])]);
    }
  };

  const handleCreateCustomLeave = () => {
    const trimmed = customLeaveName.trim();
    if (!trimmed) return alert('Enter a name for the custom leave.');
    if (leaveStatus[trimmed]) return alert('This leave already exists.');

    setCustomLeaves([...customLeaves, trimmed]);
    setLeaveStatus(prev => ({ ...prev, [trimmed]: true }));
    setLeaveQuotas(prev => ({ ...prev, [trimmed]: { yearly: 0, monthly: 0 } }));
    setSelectedLeaves(prev => [...prev, trimmed]);
    setCustomLeaveName('');
  };

  const saveSettings = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/leave-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workingHours,
          workingDays,
          leaveTypes: allLeaveTypes,
          customLeaves,
          leaveStatus,
          leaveQuotas,
          selectedLeaves
        })
      });

      const result = await response.json();
      if (result.success) {
        alert('✅ Settings saved successfully!');
        fetchSettings();
      } else {
        alert('❌ Failed to save settings.');
      }
    } catch (err) {
      console.error('Error saving settings:', err);
      alert('Error saving settings');
    }
  };

  if (loading) return <div className="p-6 text-lg">Loading settings...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10 text-gray-800">
      <h1 className="text-4xl font-bold text-sky-600">Admin Settings</h1>

      {/* Leave Types */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Manage Leave Types</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {allLeaveTypes.map((type) => (
            <div key={type} className="p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-lg">{type}</span>
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={leaveStatus[type] || false}
                      onChange={() => handleLeaveToggle(type)}
                      className="sr-only"
                    />
                    <div className={`w-10 h-5 rounded-full shadow-inner transition duration-300 ${
                      leaveStatus[type] ? 'bg-sky-500' : 'bg-gray-300'
                    }`} />
                    <div className={`dot absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition transform ${
                      leaveStatus[type] ? 'translate-x-5' : ''
                    }`} />
                  </div>
                </label>
              </div>

              {leaveStatus[type] && (
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Yearly Quota</label>
                    <input
                      type="number"
                      min="0"
                      value={leaveQuotas[type]?.yearly || ''}
                      onChange={(e) => {
                        const yearly = Number(e.target.value);
                        setLeaveQuotas(prev => ({
                          ...prev,
                          [type]: {
                            yearly,
                            monthly: yearly ? Math.round(yearly / 12) : 0
                          }
                        }));
                      }}
                      className="w-full p-2 border rounded-md"
                      placeholder="e.g. 12"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Monthly Quota</label>
                    <input
                      type="number"
                      readOnly
                      value={leaveQuotas[type]?.monthly || ''}
                      className="w-full p-2 border rounded-md bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Custom Leave */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Create Custom Leave</h2>
        <div className="flex gap-4 items-center">
          <input
            type="text"
            value={customLeaveName}
            onChange={(e) => setCustomLeaveName(e.target.value)}
            placeholder="Enter custom leave name"
            className="p-2 border rounded-md w-80"
          />
          <button
            onClick={handleCreateCustomLeave}
            className="px-4 py-2 bg-sky-500 text-white font-semibold rounded-md hover:bg-sky-600"
          >
            Create Leave
          </button>
        </div>
      </section>

      {/* Working Hours */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Working Hours</h2>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <input
            type="range"
            min="1"
            max="12"
            value={workingHours}
            onChange={(e) => setWorkingHours(Number(e.target.value))}
            className="w-full sm:w-64 accent-sky-500"
          />
          <div className="text-gray-600">
            <strong className="text-sky-600">{workingHours}</strong> hours/day
          </div>
        </div>
      </section>

      {/* Working Days */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Working Days Per Week</h2>
        <div className="flex gap-4">
          {[4, 5, 6].map((day) => (
            <button
              key={day}
              onClick={() => setWorkingDays(day)}
              className={`px-4 py-2 rounded-full border font-medium transition ${
                workingDays === day
                  ? 'bg-sky-500 text-white shadow'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {day} Days
            </button>
          ))}
        </div>
      </section>

      {/* Save Button & Summary */}
      <section className="border-t pt-6 mt-8">
        <h2 className="text-xl font-medium mb-4">Current Settings</h2>
        <div className="bg-gray-50 p-4 rounded border shadow-sm text-sm space-y-2">
          <p><strong>Working Hours:</strong> {workingHours} hrs/day</p>
          <p><strong>Working Days:</strong> {workingDays} days/week</p>
          <p><strong>Enabled Leaves:</strong> {
            allLeaveTypes.filter(type => leaveStatus[type]).join(', ') || 'None'
          }</p>
          {customLeaves.length > 0 && (
            <p><strong>Custom Leaves:</strong> {customLeaves.join(', ')}</p>
          )}
          <div>
            <p className="font-semibold">Leave Quotas:</p>
            <ul className="list-disc ml-6">
              {Object.entries(leaveQuotas).map(([type, quota]) =>
                leaveStatus[type] ? (
                  <li key={type}>
                    {type}: {quota.yearly} yearly / {quota.monthly} monthly
                  </li>
                ) : null
              )}
            </ul>
          </div>
        </div>

        <button
          onClick={saveSettings}
          className="mt-6 px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold rounded hover:from-sky-600 hover:to-blue-700 shadow-md"
        >
          <CheckCircle className="inline-block mr-2" size={18} />
          Save Settings
        </button>
      </section>
    </div>
  );
};

export default AdminSettings;
