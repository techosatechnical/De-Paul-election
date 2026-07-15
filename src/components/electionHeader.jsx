import { FaTrophy, FaEdit, FaTrash } from "react-icons/fa";

export default function ElectionHeader({ electionTitle, setPasswordAction, setShowPasswordModal, handleDeleteElection }) {
  return (
    <div className="w-full max-w-6xl flex flex-wrap justify-between items-center mb-4 px-2 gap-2">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-center animate-fade-in flex-1 tracking-tight break-words min-w-0">
        {electionTitle}
      </h1>
      <div className="flex space-x-2 flex-shrink-0">
        <button
          onClick={() => {
            setPasswordAction("results");
            setShowPasswordModal(true);
          }}
          className="p-2 sm:p-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 rounded-full hover:from-yellow-300 hover:to-orange-300 transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
          aria-label="Show election results"
        >
          <FaTrophy size={18} className="sm:w-5 sm:h-5" />
        </button>
        <button
          onClick={() => {
            setPasswordAction("admin");
            setShowPasswordModal(true);
          }}
          className="p-2 sm:p-3 bg-gradient-to-r from-blue-400 to-indigo-400 text-gray-900 rounded-full hover:from-blue-300 hover:to-indigo-300 transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
          aria-label="Open admin panel"
        >
          <FaEdit size={18} className="sm:w-5 sm:h-5" />
        </button>       
      </div>
    </div>
  );
}