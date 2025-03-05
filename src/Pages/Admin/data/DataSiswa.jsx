/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import Navigation from "../../../components/nav";
import { data, useNavigate } from "react-router-dom";
import { CiFilter } from "react-icons/ci";
import FilterComponent from "../../../components/filter";
import { baseUrl } from "../../../Utils/constan";
import fileDownload from "js-file-download";
import { toast } from "react-toastify";
import detailPreparing from "../../../Utils/detailPreparing";

const DataSiswa = () => {
  const navigate = useNavigate();
  const [siswa, setSiswa] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [jurusans, setJurusans] = useState([]);
  const [angkatans, setAngkatans] = useState([]);
  const [filters, setFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [file, setFile] = useState(null);

  useEffect(() => {
    axios
      .get(`${baseUrl}/admin/akun`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setSiswa(res.data));
  }, []);

  useEffect(() => {
    if (!siswa) return;
    let data = siswa.filter((s) =>
      s.nama.toLowerCase().includes(searchKey.toLowerCase())
    );

    const selectedAngkatans = angkatans
      .filter((x) => x.checked)
      .map((x) => x.tahun);
    const selectedJurusans = jurusans
      .filter((x) => x.checked)
      .map((x) => x.nama);

    if (selectedAngkatans.length)
      data = data.filter((s) => selectedAngkatans.includes(s.angkatan));
    if (selectedJurusans.length)
      data = data.filter((s) => selectedJurusans.includes(s.jurusan));

    setFiltered(data);
  }, [siswa, searchKey, angkatans, jurusans]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleImport = async (e) => {
    e.preventDefault();
    if (!file) return alert("Pilih data terlebih dahulu");

    const formData = new FormData();
    formData.append("file", file);
    try {
      await axios.post(`${baseUrl}/import-excel`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("File berhasil diunggah");
    } catch {
      alert("File gagal diunggah");
    }
  };

  const exportData = () => {
    const searchQuery = searchKey;
    const jurusanQuery = jurusans
      .filter((x) => x.checked)
      .map((x) => x.nama)
      .join(",");
    const angkatanQuery = angkatans
      .filter((x) => x.checked)
      .map((x) => x.tahun)
      .join(",");
    axios
      .get(
        `${baseUrl}/admin/export-excel?search=${searchQuery}&jurusan=${jurusanQuery}&angkatan=${angkatanQuery}`,
        {
          responseType: "blob",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then((response) => {
        fileDownload(response.data, "data-siswa.xlsx");
        toast.success("Ekspor Excel berhasil");
      })
      .catch((error) => {
        console.error("Download error:", error);
        toast.error("Gagal mengekspor Excel!");
      });
  };

  const exportDataPDF = () => {
    const searchQuery = searchKey;
    const jurusanQuery = jurusans
      .filter((x) => x.checked)
      .map((x) => x.nama)
      .join(",");
    const angkatanQuery = angkatans
      .filter((x) => x.checked)
      .map((x) => x.tahun)
      .join(",");
    const userChoice = window.confirm(
      "Unduh halaman depan? (Klik Batal untuk halaman belakang)"
    );

    const url = userChoice
      ? `${baseUrl}/admin/export-pdf?search=${searchQuery}&jurusan=${jurusanQuery}&angkatan=${angkatanQuery}`
      : `${baseUrl}/admin/export-raport-template`;

    axios
      .get(url, {
        responseType: "blob",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        fileDownload(
          response.data,
          userChoice ? "data-siswa.pdf" : "nilai-siswa.pdf"
        );
        toast.success("Ekspor PDF berhasil");
      })
      .catch((error) => {
        console.error("Download error:", error);
        toast.error("Gagal mengekspor PDF!");
      });
  };

  const exportDataPDFHalBelakang = (e) => {
    // e.preventDefault()
    const searchQuery = searchKey;
    const jurusanQuery = jurusans
      .filter((x) => x.checked)
      .map((x) => x.nama)
      .join(",");
    const angkatanQuery = angkatans
      .filter((x) => x.checked)
      .map((x) => x.tahun)
      .join(",");

    // const semester = prompt("Masukkan semester 1-5")
    const url = `${baseUrl}/admin/export-raport-pdf?&jurusan=${jurusanQuery}&angkatan=${angkatanQuery}`;

    axios
      .get(url, {
        responseType: "blob",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        fileDownload(response.data, "data-siswa.pdf");
        toast.success("Ekspor PDF berhasil");
      })
      .catch((error) => {
        console.error("Download error:", error);
        toast.error("Gagal mengekspor PDF!");
      });
  };

  const exportDataExcelHalBelakang = (e) => {
    // e.preventDefault()
    const searchQuery = searchKey;
    const jurusanQuery = jurusans
      .filter((x) => x.checked)
      .map((x) => x.nama)
      .join(",");
    const angkatanQuery = angkatans
      .filter((x) => x.checked)
      .map((x) => x.tahun)
      .join(",");

    // const semester = prompt("Masukkan semester 1-5")
    const url = `${baseUrl}/admin/export-raport-excel?&semester=${1}&jurusanId=${1}&angkatanId=${1}`;

    axios
      .get(url, {
        responseType: "blob",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        fileDownload(response.data, "nilai-siswa.xlsx");
        toast.success("Ekspor PDF berhasil");
      })
      .catch((error) => {
        console.error("Download error:", error);
        toast.error("Gagal mengekspor PDF!");
      });
  };

  const exportDataExcelHalBelakangDummy = (e) => {
    // e.preventDefault()
    const searchQuery = searchKey;
    const jurusanQuery = jurusans
      .filter((x) => x.checked)
      .map((x) => x.nama)
      .join(",");
    const angkatanQuery = angkatans
      .filter((x) => x.checked)
      .map((x) => x.tahun)
      .join(",");

    // const semester = prompt("Masukkan semester 1-5")
    const url = `${baseUrl}/admin/export-raport-template?semester=${1}&jurusan=${jurusanQuery}&angkatan=${angkatanQuery}`;

    axios
      .get(url, {
        responseType: "blob",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        fileDownload(response.data, "nilai-siswa.xlsx");
        toast.success("Ekspor PDF berhasil");
      })
      .catch((error) => {
        console.error("Download error:", error);
        toast.error("Gagal mengekspor PDF!");
      });
  };

  const exportDataPDFdpan = (e) => {
    // e.preventDefault()
    const searchQuery = searchKey;
    const jurusanQuery = jurusans
      .filter((x) => x.checked)
      .map((x) => x.nama)
      .join(",");
    const angkatanQuery = angkatans
      .filter((x) => x.checked)
      .map((x) => x.tahun)
      .join(",");

    // const semester = prompt("Masukkan semester 1-5")
    const url = `${baseUrl}/admin/export-pdf?search=${searchQuery}&jurusan=${jurusanQuery}&angkatan=${angkatanQuery}`;

    axios
      .get(url, {
        responseType: "blob",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        fileDownload(response.data, "data-siswa.pdf");
        toast.success("Ekspor PDF berhasil");
      })
      .catch((error) => {
        console.error("Download error:", error);
        toast.error("Gagal mengekspor PDF!");
      });
  };

  const exportDataExcel = (e) => {
    // e.preventDefault()
    const searchQuery = searchKey;
    const jurusanQuery = jurusans
      .filter((x) => x.checked)
      .map((x) => x.nama)
      .join(",");
    const angkatanQuery = angkatans
      .filter((x) => x.checked)
      .map((x) => x.tahun)
      .join(",");

    // const semester = prompt("Masukkan semester 1-5")
    const url = `${baseUrl}/admin/export-excel?&semester=${1}&jurusanId=${1}&angkatanId=${1}`;

    axios
      .get(url, {
        responseType: "blob",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        fileDownload(response.data, "nilai-siswa.xlsx");
        toast.success("Ekspor PDF berhasil");
      })
      .catch((error) => {
        console.error("Download error:", error);
        toast.error("Gagal mengekspor PDF!");
      });
  };

  const exportDataExcelDummy = (e) => {
    // e.preventDefault()
    const searchQuery = searchKey;
    const jurusanQuery = jurusans
      .filter((x) => x.checked)
      .map((x) => x.nama)
      .join(",");
    const angkatanQuery = angkatans
      .filter((x) => x.checked)
      .map((x) => x.tahun)
      .join(",");

    // const semester = prompt("Masukkan semester 1-5")
    const url = `${baseUrl}/admin/export-raport-template?semester=${1}&jurusan=${jurusanQuery}&angkatan=${angkatanQuery}`;

    axios
      .get(url, {
        responseType: "blob",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        fileDownload(response.data, "nilai-siswa.xlsx");
        toast.success("Ekspor PDF berhasil");
      })
      .catch((error) => {
        console.error("Download error:", error);
        toast.error("Gagal mengekspor PDF!");
      });
  };

  const handleDetailClick = (id) => {
    detailPreparing(id);
    localStorage.setItem("akun-id", id);
    navigate(`/admin/lihat/${id}/biodata`);
  };

  const [selected, setSelected] = useState("Option 1");
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);

  const options = ["Option 1", "Option 2", "Option 3", "Option 4"];

  return (
    <div className="flex h-screen font-body">
      <Navigation />
      <div className="flex-1 p-6 bg-white text-black overflow-y-scroll">
        <h1 className="text-3xl font-normal ml-2">Data Siswa</h1>
        <header className="flex justify-end gap-4 my-5">
          <div className="relative inline-block text-left">
            <button
              onClick={() => {
                setOpen(!open);
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md"
            >
              Halaman Belakang
            </button>
            <div
              className={`absolute mt-2 w-40 bg-white border rounded-lg shadow-lg ${
                !open ? "hidden" : "block"
              }`}
            >
              <button
                className={`block w-full px-4 py-2 text-left hover:bg-blue-500 hover:text-white transition `}
                onClick={(e) => exportDataPDFHalBelakang(e)}
              >
                Export PDF
              </button>
              <button
                className={`block w-full px-4 py-2 text-left hover:bg-blue-500 hover:text-white transition `}
                onClick={(e) => exportDataExcelHalBelakang(e)}
              >
                Export Excel
              </button>
              <button
                className={`block w-full px-4 py-2 text-left hover:bg-blue-500 hover:text-white transition `}
                onClick={(e) => exportDataExcelHalBelakangDummy(e)}
              >
                Export Contoh Excel
              </button>
            </div>
          </div>
          <div className="relative inline-block text-left">
            <button
              onClick={() => {
                setOpen2(!open2);
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md"
            >
              Halaman Depan
            </button>
            <div
              className={`absolute mt-2 w-40 bg-white border rounded-lg shadow-lg ${
                !open2 ? "hidden" : "block"
              }`}
            >
              <button
                className={`block w-full px-4 py-2 text-left hover:bg-blue-500 hover:text-white transition `}
                onClick={(e) => exportDataPDFdpan(e)}
              >
                Export PDF
              </button>
              <button
                className={`block w-full px-4 py-2 text-left hover:bg-blue-500 hover:text-white transition `}
                onClick={(e) => exportDataExcel(e)}
              >
                Export Excel
              </button>
              <button
                className={`block w-full px-4 py-2 text-left hover:bg-blue-500 hover:text-white transition `}
                onClick={(e) => exportDataExcelHalBelakangDummy(e)}
              >
                Export Contoh Excel
              </button>
            </div>
          </div>
          {/* <button onClick={() => exportData()} className="bg-blue-500 rounded-sm py-1 px-2 text-white">Unduh Excel</button>
          <button onClick={() => exportDataPDF()} className="bg-blue-500 rounded-sm py-1 px-2 text-white">Unduh PDF</button>
          <button onClick={() => exportDataPDF()} className="bg-blue-500 rounded-sm py-1 px-2 text-white">Unduh Format</button> */}
          <form onSubmit={handleImport} className="flex gap-5">
            <input
              type="file"
              onChange={handleFileChange}
              className="border border-black rounded-sm py-1 px-2 file:bg-gray-300 file:rounded file:border file:border-black file:p-1 placeholder:ml-2"
            />
            <button
              type="submit"
              className="bg-blue-500 rounded-sm py-1 px-2 text-white"
            >
              Impor Excel
            </button>
          </form>
        </header>
        <div className="grid grid-cols-10 gap-5 mt-6">
          <input
            type="search"
            placeholder="Cari.."
            className="border border-gray-400 rounded-sm col-span-9 p-2"
            onChange={(e) => setSearchKey(e.target.value)}
          />
          <button
            onClick={() => setFilters(!filters)}
            className="border border-gray-400 rounded-sm text-black col-span-1 p-2 flex items-center justify-center"
          >
            <CiFilter className="mr-2" /> Filter
          </button>
        </div>
        {filters && (
          <FilterComponent
            stateAngkatan={setAngkatans}
            stateJurusan={setJurusans}
          />
        )}

        <table className="w-full mt-8 border border-gray-300">
          <thead className="bg-gray-200 border p-2">
            <tr>
              <th className="border p-2">No</th>
              <th className="border p-2">NISN</th>
              <th className="border p-2">Nama</th>
              <th className="border p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((s, index) => (
              <tr key={s.id} className="text-center border">
                <td className="border px-4 py-2">
                  {indexOfFirstItem + index + 1}
                </td>
                <td className="border px-4 py-2">{s.nisn}</td>
                <td className="border px-4 py-2">{s.nama}</td>
                <td className="px-4 py-2 justify-center">
                  <button
                    onClick={() => handleDetailClick(s.id)}
                    className="bg-blue-500 rounded-sm p-2 text-white border"
                  >
                    Detail Siswa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-center mt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="px-4 py-2 mx-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Kembali
          </button>
          <span className="px-4 py-2">
            {currentPage} / {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="px-4 py-2 mx-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Selanjutnya
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataSiswa;
