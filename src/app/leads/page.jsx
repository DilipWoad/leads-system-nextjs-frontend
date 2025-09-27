"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../constant";
import LoadingScreen from "../components/LoadingScreen.jsx";
export default function Lead() {
  const [showAddLeadOptions, setShowAddLeadOptions] = useState(false);
  const [editingLeadId, setEditingLeadId] = useState(null);
  const [updateOptions, setUpdateOptions] = useState(false);
  const leadForm = {
    name: "",
    email: "",
    phone: "",
    status: "New",
  };
  const [newLead, setNewLead] = useState(leadForm);

  const [updateStatus, setUpdateStatus] = useState(null);

  const [allLeads, setAllLeads] = useState(null);

  const statusOptions = ["New", "InProgress", "Converted"];

  const [selectedRow, setSelectedRow] = useState(null);

  const handleSave = async () => {
    //on save what should happen
    try {
      const res = await axios.post(`${BASE_URL}/leads`, newLead, {
        withCredentials: true,
      });
      // console.log(res.data);
      allLeads.unshift(res.data.data);
    } catch (error) {
      console.log("Error while sending new leads details : ", error);
    } finally {
      setShowAddLeadOptions(false);
      setNewLead(leadForm);
    }
    //1)POST req to the backend
    //2)get the response
    //3)add the response to the allLeads []
    //4)then set the showoption as false
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewLead((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // const handleChangeEmail = (e) => {
  //   setEmail(e.target.value);
  // };
  // const handleChangeName = (e) => {
  //   setLeadName(e.target.value);
  // };
  // const handleChangePhone = (e) => {
  //   setPhoneNo(e.target.value);
  // };

  const getLeads = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/leads`, {
        withCredentials: true,
      });
      // console.log(res.data);
      setAllLeads(res.data.data);
    } catch (error) {
      console.log("Error on fecting leads. :", error);
    }
  };

  const handleStatusClick = (id) => {
    setEditingLeadId(id);
  };

  const handleRowClick = (id) => {
    setSelectedRow(id);
  };

  const handleCancelBtn = () => {
    if (editingLeadId !== null) {
      setEditingLeadId(null);
    }
    if (selectedRow !== null) {
      setSelectedRow(null);
    }
  };

  // console.log("selected row :", selectedRow);
  // console.log(editingLeadId);
  // console.log("uhvhvjvvgkkvggvk", updateStatus);

  const handleStatusChange = async (e) => {
    setUpdateStatus(e.target.value);
  };

  const handleUpdateStatus = async (leadId, newStatus) => {
    const updatedStatus = allLeads.map((lead) =>
      lead.id === leadId ? { ...lead, status: newStatus } : lead
    );
    setAllLeads(updatedStatus);
    setEditingLeadId(null);
    try {
      const res = await axios.patch(
        `${BASE_URL}/leads/${leadId}`,
        { status: newStatus },
        { withCredentials: true }
      );
      // console.log(res);
    } catch (error) {
      console.log("Error while updating Lead Status : ", error.message);
      setAllLeads(allLeads);
    } finally {
      setUpdateStatus(null);
    }
  };

  const handleDeleteLead = async (leadId) => {
    const updatedLeads = allLeads.filter((lead) => lead.id !== leadId);
    // console.log(updatedLeads)
    setAllLeads(updatedLeads);
    try {
      const res = await axios.delete(`${BASE_URL}/leads/${leadId}`, {
        withCredentials: true,
      });
      // console.log(res.data);
      //also make the selectedRow to null
      setSelectedRow(null);
    } catch (error) {
      console.log("Error while deleting lead : ",error.message)
      setAllLeads(allLeads);
    }
  };

  useEffect(() => {
    getLeads();
  }, []);
  if (!allLeads) {
    return <LoadingScreen/>;
  }
  return (
    <div className="w-screen h-screen  flex justify-center items-center bg-yellow-500">
      <div className="w-2/3">
        {/* align="center" */}
        {/* Add Lead Button */}
        <div className="text-end mb-5 ">
          <button
            onClick={() => setShowAddLeadOptions(true)}
            className="hover:cursor-pointer hover:bg-green-600 bg-green-500 rounded-md px-5 py-2 text-sm font-semibold"
          >
            Add Lead
          </button>
        </div>
        {/* Table  */}
        <div className="shadow-md rounded-lg overflow-hidden border border-gray-300">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100 text-xs text-gray-800 uppercase">
              <tr className="text-center">
                <th className="px-6 py-3 border-r border-gray-300">Name</th>
                <th className="px-6 py-3 border-r border-gray-300">Email</th>
                <th className="px-6 py-3 border-r border-gray-300">
                  Phone No.
                </th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {allLeads.map((lead) => (
                <tr
                  className={` text-center ${
                    selectedRow === lead.id
                      ? "bg-red-400"
                      : "bg-white hover:bg-gray-50 "
                  } `}
                  key={lead.email}
                  // onClick={()=>setUpdateOptions(true)}
                >
                  <td
                    onClick={() => handleRowClick(lead.id)}
                    className="px-6 py-4 border-r border-gray-300 hover:cursor-pointer"
                  >
                    {lead.name}
                  </td>
                  <td
                    onClick={() => handleRowClick(lead.id)}
                    className="px-6 py-4 border-r border-gray-300 hover:cursor-pointer"
                  >
                    {lead.email}
                  </td>
                  <td
                    onClick={() => handleRowClick(lead.id)}
                    className="px-6 py-4 border-r border-gray-300"
                  >
                    {lead?.phone}
                  </td>
                  <td
                    id={lead.id}
                    className="px-6 py-4 hover:cursor-pointer hover:bg-gray-200"
                  >
                    {/* if id match hota hai to select dekha nahi toh woh he rahene de  */}
                    {editingLeadId === lead.id ? (
                      <select
                        name="status"
                        defaultValue={lead.status}
                        id="select-status"
                        onChange={handleStatusChange}
                        className="bg-gray-400 p-2 rounded-lg"
                      >
                        {/* <option disabled>Select Status</option> */}
                        {statusOptions.map((status) => (
                          <option
                            className="bg-green-400 rounded-lg"
                            key={status}
                            value={status}
                          >
                            {status}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div
                        onClick={() => handleStatusClick(lead.id)}
                        className="hover:cursor-pointer p-2"
                      >
                        {lead.status}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Save Button */}
        <div className="text-end mt-5 space-x-4 ">
          {selectedRow !== null && (
            <button
              disabled={selectedRow === null}
              onClick={() => handleDeleteLead(selectedRow)}
              className={`text-white rounded-md px-5 py-2 text-sm font-semibold ${
                selectedRow === null
                  ? "hover:cursor-not-allowed bg-red-400 text-gray-500"
                  : "bg-red-600 hover:cursor-pointer hover:bg-red-700 transition-all duration-200 text-white"
              }`}
            >
              Delete
            </button>
          )}
          <button
            onClick={() => handleCancelBtn()}
            className={`text-gray-600 hover:cursor-pointer bg-white rounded-md px-5 py-2 text-sm font-semibold `}
          >
            Cancel
          </button>

          {selectedRow === null && (
            <button
              disabled={updateStatus === null}
              onClick={() => handleUpdateStatus(editingLeadId, updateStatus)}
              className={`text-white rounded-md px-5 py-2 text-sm font-semibold ${
                updateStatus === null
                  ? "hover:cursor-not-allowed bg-blue-400 text-gray-500"
                  : "bg-blue-600 hover:cursor-pointer hover:bg-blue-700 transition-all duration-200 text-white"
              }`}
            >
              Save
            </button>
          )}
        </div>
      </div>
      {showAddLeadOptions && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
          <div className="bg-white min-w-80 flex flex-col gap-4 p-4 rounded-lg shadow-lg">
            {/* Lead Name */}
            <div className="flex justify-between items-center">
              <label htmlFor="name">Name : </label>
              <input
                className="bg-gray-200 p-2 rounded-lg"
                type="text"
                name="name"
                id="name"
                defaultValue={newLead.name}
                //   value={email}
                placeholder="Enter Name..."
                required={true}
                onChange={handleChange}
              />
            </div>
            {/* Lead Email */}
            <div className="flex justify-between items-center">
              <label htmlFor="email">Email : </label>
              <input
                className="bg-gray-200 p-2 rounded-lg"
                type="text"
                name="email"
                id="email"
                defaultValue={newLead.email}
                //   value={email}
                placeholder="Enter Email..."
                required={true}
                onChange={handleChange}
              />
            </div>
            {/* Lead Phone */}
            <div className="flex justify-between items-center">
              <label htmlFor="phone">Phone No. : </label>
              <input
                className="bg-gray-200 p-2 rounded-lg"
                type="tel"
                name="phone"
                id="phone"
                defaultValue={newLead.phone}
                //   value={email}
                placeholder="Ex 8947569346"
                required={false}
                onChange={handleChange}
              />
            </div>
            {/* Lead Status */}
            <div className="flex justify-between items-center">
              <label htmlFor="status-select">Status : </label>
              <select
                name="status"
                defaultValue={newLead.status}
                id="status-select"
                onChange={handleChange}
                className="bg-gray-200 p-2 rounded-lg"
              >
                {/* <option disabled>Select Status</option> */}
                {statusOptions.map((status) => (
                  <option
                    className="bg-green-400 rounded-lg"
                    key={status}
                    value={status}
                  >
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-3">
              <button
                className="hover:cursor-pointer hover:bg-gray-500 bg-gray-400 rounded-md px-7 py-2 text-sm font-semibold"
                onClick={() => setShowAddLeadOptions(false)}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="hover:cursor-pointer hover:bg-blue-600 bg-blue-500 rounded-md px-7 py-2 text-sm font-semibold"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
