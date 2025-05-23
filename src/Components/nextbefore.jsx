import { useParams } from "react-router";

const Nextbefore = ({ back, next, lastpage }) => {
  const params = useParams();
  
  return (
    <div className="grid grid-cols-2 mt-6 gap-4 w-full">
      <button
        onClick={back}
        className="w-full py-2 rounded-lg text-white bg-gray-600 hover:bg-gray-700 transition duration-300 shadow-md"
      >
        Kembali
      </button>
      {!lastpage ? (
        <button
          onClick={next}
          className="w-full py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition duration-300 shadow-md"
        >
          Lanjut
        </button>
      ) : null}
      {((!isNaN(parseInt(params.id)) && lastpage) || (params.action === "upload" && lastpage)) && (
        <button
          onClick={next}
          className="w-full py-2 rounded-lg text-white bg-green-600 hover:bg-green-700 transition duration-300 shadow-md"
        >
          Simpan
        </button>
      )}
    </div>
  );
};

export default Nextbefore;
