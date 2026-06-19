export default function NomineeButton({
  nominee,
  categoryTitle,
  selectedNominees,
  handleSelectNominee,
}) {
  const isSelected = selectedNominees[categoryTitle] === nominee.name;

  return (
    <button
      type="button"
      onClick={() => handleSelectNominee(categoryTitle, nominee.name)}
      className={`
        w-full h-full flex items-center justify-between gap-2 px-3 rounded-xl font-semibold
        transition-all duration-200
        ${isSelected
          ? "bg-gradient-to-r from-green-400 to-teal-400 text-gray-900 ring-2 ring-green-300 shadow-[0_0_12px_rgba(52,211,153,0.5)]"
          : "bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 hover:from-yellow-300 hover:to-orange-300 hover:scale-[1.02]"
        }
      `}
      aria-label={`Select ${nominee.name} for ${categoryTitle}`}
    >
      {/* Left: photo + name */}
      <div className="flex items-center gap-3 min-w-0">
        {nominee.photo && nominee.photo !== "/loading.png" && (
          <img
            src={nominee.photo}
            alt={nominee.name}
            className="w-12 h-12 rounded-full object-cover flex-shrink-0 ring-2 ring-white/60 shadow-md"
          />
        )}
        <span className="text-base font-bold truncate">{nominee.name}</span>
      </div>

      {/* Right: logo + selection indicator */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {nominee.logo && nominee.logo !== "/loading.png" && (
          <img
            src={nominee.logo}
            alt={`${nominee.name} logo`}
            className="w-10 h-10 rounded-full object-cover ring-1 ring-white/40 shadow"
          />
        )}
        {/* Dot indicator */}
        <span
          className={`w-2.5 h-2.5 rounded-full transition-colors duration-200 ${
            isSelected ? "bg-white shadow-[0_0_6px_rgba(255,255,255,0.8)]" : "bg-gray-800/40"
          }`}
        />
      </div>
    </button>
  );
}
