import CategoryCard from "./categoryCard";

// Pick a clean column count based on how many categories exist
function getGridCols(count) {
  if (count <= 2) return count;
  if (count <= 4) return 2;
  return 3;
}

export default function VotingForm({
  categories,
  selectedNominees,
  handleSelectNominee,
  handleSubmit,
  voterCount,
  isSubmitting,
}) {
  const cols = getGridCols(categories.length);

  return (
    <form
      action={handleSubmit}
      className="flex-1 w-full flex flex-col overflow-hidden"
      style={{ maxWidth: cols === 1 ? "480px" : cols === 2 ? "860px" : "1200px" }}
    >
      {/* ── Category grid ────────────────────────────── */}
      <div
        className="flex-1 grid gap-4 overflow-hidden"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${Math.ceil(categories.length / cols)}, minmax(0, 1fr))`,
        }}
      >
        {[...categories].sort((a, b) => {
          const getOrder = (title) => {
            const t = title.toLowerCase().replace(/[^a-z]/g, '');
            if (t.includes("headboy")) return 1;
            if (t.includes("headgirl")) return 2;
            if (t.includes("sportsclub")) return 3;
            if (t.includes("artsclub")) return 4;
            return 5;
          };
          return getOrder(a.title) - getOrder(b.title);
        }).map((category, index) => (
          <CategoryCard
            key={index}
            category={category}
            selectedNominees={selectedNominees}
            handleSelectNominee={handleSelectNominee}
          />
        ))}
      </div>

      {/* ── Footer bar ───────────────────────────────── */}
      <div className="flex-shrink-0 flex items-center justify-between pt-3 px-1">
        {/* Voter count badge */}
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-1.5">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-sm font-semibold text-white">
            {voterCount} {voterCount === 1 ? "vote" : "votes"} cast
          </span>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-gradient-to-r from-green-400 to-teal-400 text-gray-900 px-8 py-2 rounded-full font-bold hover:from-green-300 hover:to-teal-300 transition-all duration-300 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed text-sm shadow-lg"
          aria-label="Submit all votes"
        >
          {isSubmitting ? "Submitting…" : "Submit Votes"}
        </button>
      </div>
    </form>
  );
}