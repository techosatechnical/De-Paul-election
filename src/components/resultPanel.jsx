import Image from "next/image";

// Same column logic as voting form
function getGridCols(count) {
  if (count <= 2) return count;
  if (count <= 4) return 2;
  return 3;
}

export default function ResultsPanel({ results, setShowResults, electionTitle }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      {/* Modal card — fits the screen */}
      <div
        className="flex flex-col bg-white/20 backdrop-blur-xl rounded-3xl border border-yellow-300/40 shadow-2xl overflow-hidden w-full max-w-6xl"
        style={{ maxHeight: "90vh" }}
      >
        {/* ── Header ── */}
        <div className="flex-shrink-0 px-6 py-3 bg-white/10 border-b border-white/15 text-center">
          <h2 className="text-lg font-extrabold text-yellow-300 tracking-wide animate-pulse">
            🏆 {electionTitle} — Results
          </h2>
        </div>

        {/* ── Results grid ── */}
        <div
          className="flex-1 grid gap-4 p-4 overflow-y-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        >
          {results.map((category, index) => {
            const sorted = [...category.nominees].sort((a, b) => b.votes - a.votes);
            const winner = sorted[0];
            const isSingleCategory = results.length === 1;

            return (
              <div
                key={index}
                className={`flex flex-col bg-white/15 border border-white/20 rounded-2xl overflow-hidden ${
                  isSingleCategory ? "col-span-full" : ""
                }`}
              >
                {/* Category title strip */}
                <div className="flex-shrink-0 bg-white/10 px-4 py-1.5 border-b border-white/15">
                  <h3 className="text-xs font-bold text-center text-purple-200 tracking-widest uppercase">
                    {category.title}
                  </h3>
                </div>

                {/* Nominee rows */}
                <div className={`grid gap-2 p-3 ${isSingleCategory ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}>
                  {sorted.map((nominee, idx) => {
                    const isWinner = nominee.name === winner.name;
                    return (
                      <div
                        key={idx}
                        className={`flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-gray-900 font-semibold text-sm transition-all duration-200 min-h-[44px]
                          ${isWinner
                            ? "bg-gradient-to-r from-yellow-400 to-orange-400 ring-2 ring-yellow-300 shadow-[0_0_12px_rgba(251,191,36,0.5)]"
                            : "bg-white/30 text-white"
                          }`}
                      >
                        {/* Left: rank + photo + name */}
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <span className="text-xs font-black opacity-70 w-5 flex-shrink-0">
                            {isWinner ? "🥇" : `#${idx + 1}`}
                          </span>
                          {nominee.photo && nominee.photo !== "/loading.png" && (
                            <Image
                              src={nominee.photo}
                              alt={nominee.name}
                              width={36}
                              height={36}
                              className="rounded-full object-cover flex-shrink-0 ring-2 ring-white/60 shadow-md"
                            />
                          )}
                          {nominee.logo && nominee.logo !== "/loading.png" && (
                            <Image
                              src={nominee.logo}
                              alt={`${nominee.name} logo`}
                              width={32}
                              height={32}
                              className="rounded-full object-cover flex-shrink-0 ring-1 ring-white/40 shadow"
                            />
                          )}
                          <span className="truncate font-bold text-xs sm:text-sm">{nominee.name}</span>
                        </div>

                        {/* Right: vote count */}
                        <span className="flex-shrink-0 text-xs font-bold">
                          {nominee.votes} {nominee.votes === 1 ? "vote" : "votes"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Close button ── */}
        <div className="flex-shrink-0 flex justify-center pb-4">
          <button
            onClick={() => setShowResults(false)}
            className="bg-gradient-to-r from-red-400 to-pink-400 text-gray-900 px-8 py-2 rounded-full font-bold hover:from-red-300 hover:to-pink-300 transition-all duration-300 hover:scale-105 text-sm shadow-lg"
            aria-label="Close results"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
