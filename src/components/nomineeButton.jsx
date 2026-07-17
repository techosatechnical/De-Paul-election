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
        w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl font-bold
        transition-all duration-200 min-h-[64px] sm:min-h-[76px]
        ${isSelected
          ? "bg-gradient-to-r from-green-400 to-teal-400 text-gray-900 ring-2 ring-green-300 shadow-[0_0_14px_rgba(52,211,153,0.6)]"
          : "bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 hover:from-yellow-300 hover:to-orange-300 hover:scale-[1.02]"
        }
      `}
      aria-label={`Select ${nominee.name} for ${categoryTitle}`}
    >
      {/* Left: photo + name */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {nominee.photo && nominee.photo !== "/loading.png" && (
          <img
            src={nominee.photo}
            alt={nominee.name}
            className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover flex-shrink-0 ring-2 ring-white/60 shadow-md"
          />
        )}
        <span className="text-sm sm:text-base md:text-lg font-extrabold truncate">{nominee.name}</span>
      </div>

      {/* Right: logo + selection indicator */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {nominee.logo && nominee.logo !== "/loading.png" && (
          <img
            src={nominee.logo}
            alt={`${nominee.name} logo`}
            className="w-9 h-9 sm:w-11 sm:h-11 rounded-full object-cover ring-1 ring-white/40 shadow"
          />
        )}
        {/* Dot indicator */}
        <span
          className={`w-3 h-3 rounded-full transition-colors duration-200 ${isSelected ? "bg-white shadow-[0_0_6px_rgba(255,255,255,0.8)]" : "bg-gray-800/40"
            }`}
        />
      </div>
    </button>
  );
}
