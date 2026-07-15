import NomineeButton from "./nomineeButton";

export default function CategoryCard({ category, selectedNominees, handleSelectNominee }) {
  return (
    <div className="flex flex-col bg-white/15 backdrop-blur-md rounded-2xl border border-white/25 shadow-lg overflow-hidden h-full">
      {/* Card header */}
      <div className="flex-shrink-0 bg-white/10 px-4 py-2 border-b border-white/15">
        <h2 className="text-xs font-bold text-center text-yellow-300 tracking-widest uppercase">
          {category.title}
        </h2>
      </div>

      {/* Nominees */}
      <div className="flex flex-col gap-2 p-3">
        {category.nominees.map((nominee, idx) => (
          <NomineeButton
            key={idx}
            nominee={nominee}
            categoryTitle={category.title}
            selectedNominees={selectedNominees}
            handleSelectNominee={handleSelectNominee}
          />
        ))}
      </div>
    </div>
  );
}