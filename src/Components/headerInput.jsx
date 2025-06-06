/* eslint-disable no-unused-vars */
import { useNavigate, useParams } from "react-router";
import {
  isAkunFilled,
  isBiodataFilled,
  isTempattinggalFilled,
  isKesehatanFilled,
  isPendidikanFilled,
  isAyahFilled,
  isIbuFilled,
  isHobiFilled,
} from "../Utils/check";


/* 

=====================================================================================================
                    H E A D E R _ I N P U T _ C O M P O N E N T 
  >> Developed By. Ananda Eka <<

[#] Note : Mengikuti desain

=====================================================================================================

*/

const HeaderButton = ({ nama, isActive = false, to }) => {
  const navigate = useNavigate();

  const bukaDanCek = () => {
    switch (nama) {
      case "Biodata":
        if (!isAkunFilled()) return alert("Semua data belum terisi");
        break;
      case "Tempat Tinggal":
        if (!(isAkunFilled() && isBiodataFilled()))
          return alert("Semua data belum terisi");
        break;
      case "Kesehatan":
        if (!(isAkunFilled() && isBiodataFilled() && isTempattinggalFilled()))
          return alert("Semua data belum terisi");
        break;
      case "Pendidikan":
        if (
          !(
            isAkunFilled() &&
            isBiodataFilled() &&
            isTempattinggalFilled() &&
            isKesehatanFilled()
          )
        )
          return alert("Semua data belum terisi");
        break;
      case "Ayah":
        if (
          !(
            isAkunFilled() &&
            isBiodataFilled() &&
            isTempattinggalFilled() &&
            isKesehatanFilled() &&
            isPendidikanFilled()
          )
        )
          return alert("Semua data belum terisi");
        break;
      case "Ibu":
        if (
          !(
            isAkunFilled() &&
            isBiodataFilled() &&
            isTempattinggalFilled() &&
            isKesehatanFilled() &&
            isPendidikanFilled() &&
            isAyahFilled()
          )
        )
          return alert("Semua data belum terisi");
        break;
      case "Wali":
        if (
          !(
            isAkunFilled() &&
            isBiodataFilled() &&
            isTempattinggalFilled() &&
            isKesehatanFilled() &&
            isPendidikanFilled() &&
            isAyahFilled() &&
            isIbuFilled()
          )
        )
          return alert("Semua data belum terisi");
        break;
      case "Hobi":
        if (
          !(
            isAkunFilled() &&
            isBiodataFilled() &&
            isTempattinggalFilled() &&
            isKesehatanFilled() &&
            isPendidikanFilled() &&
            isAyahFilled() &&
            isIbuFilled() &&
            isHobiFilled()
          )
        )
          return alert("Semua data belum terisi");
        break;
    }
    navigate(to);
  };

  if (!isActive) {
    return (
      <button
        onClick={bukaDanCek}
        className="px-2 py-2 text-center text-lg font-bold font-body bg-white text-gray-500"
      >
        {nama}
      </button>
    );
  } else {
    return (
      <button
        onClick={bukaDanCek}
        className="px-2 py-2 text-center text-lg font-bold font-body bg-white text-gray-500 border-b-2  border-b-blue-700"
      >
        {nama}
      </button>
    );
  }
};

const HeaderInput = ({ title, word, form }) => {
  const params = useParams();

  const ButtonList = [
    { a: "Data Diri Siswa", b: "biodata" },
    { a: "Tempat Tinggal Siswa", b: "tempattinggal" },
    { a: "Kesehatan Siswa", b: "kesehatan" },
    { a: "Pendidikan Siswa", b: "pendidikan" },
    { a: "Keterangan Ayah", b: "ayah" },
    { a: "Keterangan Ibu", b: "ibu" },
    { a: "Keterangan Wali", b: "wali" },
    { a: "Hobi Siswa", b: "hobi" },
    { a: "Perkembangan Siswa", b: "perkembangansiswa", c: true },
    { a: "Selesai Pendidikan", b: "selesaipend", c: true },
  ];

  // Filter tombol yang akan ditampilkan
  const filteredButtons = ButtonList.filter((t) => !(t.c && form !== "admin"));

  // Tentukan jumlah kolom berdasarkan jumlah tombol
  const gridCols = `grid-cols-${filteredButtons.length}`;

  return (
    <div className="w-full">
      {/* Judul Header */}
      <div className="flex flex-row items-center w-full">
        <label className="font-header font-bold text-xl">
          {word}. {title}
        </label>
      </div>

      {/* Navigasi Button - Menggunakan Grid Dinamis */}
      <div className={`grid ${gridCols} border-gray-400 w-full`}>
        {filteredButtons.map((t, i) => (
          <HeaderButton
            key={i}
            to={
              form === "admin"
                ? `/${form}/lihat/${params.id}/${t.b}`
                : `/${form}/data/${params.action}/${t.b}`
            }
            nama={t.a}
            isActive={title === t.a}
          />
        ))}
      </div>
    </div>
  );
};

export default HeaderInput;
