/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import Navigation from "../../../Components/nav";
import { baseUrl } from "../../../utils/constan";

const DataAngkatan = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [editValue, setEditValue] = useState("");
  const [editId, setEditId] = useState(null);
  const [angkatan, setAngkatan] = useState([]);
  const [searchkey, setSearchkey] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [role, setRole] = useState(""); // State untuk menyimpan role pengguna

  // Ambil Role dari API /auth/me
  useEffect(() => {
    axios.get(baseUrl + "/auth/me", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        console.log("Role pengguna:", res.data); // Debugging
        setRole(res.data.role); // Pastikan state diperbarui
      }) // Ambil role dari response API
      .catch((err) => console.error("Gagal mengambil data user:", err));
  }, []);

  const updateAngkatan = () => {
    axios.get(baseUrl + "/admin/angkatan", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then((res) => setAngkatan(res.data));
  };

  useEffect(updateAngkatan, []);

  useEffect(() => {
    setFiltered(
      searchkey ? angkatan.filter((x) => x.tahun.toLowerCase().includes(searchkey.toLowerCase())) : angkatan
    );
  }, [searchkey, angkatan]);

  const handleAddClick = () => {
    axios.post(baseUrl + "/admin/angkatan/", { tahun: inputValue }, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then(() => {
      updateAngkatan();
      setShowDialog(false);
      setInputValue("");
    });
  };

  const handleEditClick = (id, tahun) => {
    setEditId(id);
    setEditValue(tahun);
    setEditDialog(true);
  };

  const handleUpdateClick = () => {
    axios.put(baseUrl + `/admin/angkatan/${editId}`, { tahun: editValue }, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then(() => {
      updateAngkatan();
      setEditDialog(false);
    });
  };

  return (
    <div className="flex h-screen">
      <Navigation />
      <div className="flex-1 p-6 bg-white text-black overflow-y-scroll">
        <header className="flex justify-between items-center mb-4">
          <h1 className="text-3xl">Angkatan SMKN 2 Singosari</h1>
          {role !== "petugas" && (
            <button onClick={() => setShowDialog(true)} className="bg-blue-500 text-white p-2 rounded-sm">
              Tambah Angkatan
            </button>
          )}
        </header>
        <div className="mt-6 overflow-x-auto shadow">
          <table className="min-w-full border border-gray-200 bg-white text-sm">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 border">No</th>
                <th className="px-6 py-3 border">Angkatan</th>
                <th className="px-6 py-3 border">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-center text-gray-800">
              {filtered.map((s, index) => (
                <tr
                  key={s.id}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-6 py-3 border">{index + 1}</td>
                  <td className="px-6 py-3 border">{s.tahun}</td>
                  <td className="px-6 py-3 border">
                    <button
                      disabled={role === "petugas"}
                      onClick={() => handleEditClick(s.id, s.tahun)}
                      className={`w-full px-4 py-2 rounded text-sm font-semibold transition-colors duration-200 
                ${role === "petugas"
                          ? "bg-gray-400 text-white cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700 text-white"}
              `}
                    >
                      Ubah
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showDialog && role !== "petugas" && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Tambah Angkatan</h2>
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full p-2 border rounded-lg"
              placeholder="Tahun angkatan"
            />
            <div className="flex justify-end mt-4 gap-2">
              <button
                onClick={() => setShowDialog(false)}
                className="bg-gray-500 text-white p-2 rounded-lg"
              >
                Batal
              </button>
              <button
                onClick={handleAddClick}
                className="bg-blue-500 text-white p-2 rounded-lg"
              >
                Tambah
              </button>
            </div>
          </div>
        </div>
      )}
      {editDialog && role !== "petugas" && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Ubah Angkatan</h2>
            <input value={editValue} onChange={(e) => setEditValue(e.target.value)} className="w-full p-2 border rounded-lg" />
            <div className="flex justify-end mt-4 gap-2">
              <button onClick={() => setEditDialog(false)} className="bg-gray-500 text-white p-2 rounded-lg">Batal</button>
              <button onClick={handleUpdateClick} className="bg-blue-500 text-white p-2 rounded-lg">Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataAngkatan;