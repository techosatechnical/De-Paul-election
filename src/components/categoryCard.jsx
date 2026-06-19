import NomineeButton from "./nomineeButton";

export default function CategoryCard({ category, selectedNominees, handleSelectNominee }) {
  return (
    <div className="flex flex-col bg-white/15 backdrop-blur-md rounded-2xl border border-white/25 shadow-lg overflow-hidden">
      {/* Card header */}
      <div className="flex-shrink-0 bg-white/10 px-4 py-2 border-b border-white/15">
        <h2 className="text-xs font-bold text-center text-yellow-300 tracking-widest uppercase">
          {category.title}
        </h2>
      </div>

      {/* Nominees — each takes equal height */}
      <div className="flex-1 flex flex-col gap-2 p-3">
        {category.nominees.map((nominee, idx) => (
          <div key={idx} className="flex-1 flex min-h-0">
            <NomineeButton
              nominee={nominee}
              categoryTitle={category.title}
              selectedNominees={selectedNominees}
              handleSelectNominee={handleSelectNominee}
            />
          </div>
        ))}
      </div>
    </div>
  );
}