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
        w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl font-semibold
        transition-all duration-200 min-h-[44px]
        ${isSelected
          ? "bg-gradient-to-r from-green-400 to-teal-400 text-gray-900 ring-2 ring-green-300 shadow-[0_0_12px_rgba(52,211,153,0.5)]"
          : "bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 hover:from-yellow-300 hover:to-orange-300 hover:scale-[1.02]"
        }
      `}
      aria-label={`Select ${nominee.name} for ${categoryTitle}`}
    >
      {/* Left: photo + name */}
      <div className="flex items-center gap-2 min-w-0 flex-1">
        {nominee.photo && nominee.photo !== "/loading.png" && (
          <img
            src={nominee.photo}
            alt={nominee.name}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0 ring-2 ring-white/60 shadow-md"
          />
        )}
        <span className="text-xs sm:text-sm font-bold truncate">{nominee.name}</span>
      </div>

      {/* Right: logo + selection indicator */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {nominee.logo && nominee.logo !== "/loading.png" && (
          <img
            src={nominee.logo}
            alt={`${nominee.name} logo`}
            className="w-7 h-7 sm:w-9 sm:h-9 rounded-full object-cover ring-1 ring-white/40 shadow"
          />
        )}
        {/* Dot indicator */}
        <span
          className={`w-2.5 h-2.5 rounded-full transition-colors duration-200 ${isSelected ? "bg-white shadow-[0_0_6px_rgba(255,255,255,0.8)]" : "bg-gray-800/40"
            }`}
        />
      </div>
    </button>
  );
}
