import Image from "next/image";

// Same column logic as voting form
function getGridCols(count) {
  if (count <= 2) return count;
  if (count <= 4) return 2;
  return 3;
}

export default function ResultsPanel({ results, setShowResults, electionTitle }) {
  const cols = getGridCols(results.length);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      {/* Modal card — fits the screen, no scroll */}
      <div
        className="flex flex-col bg-white/20 backdrop-blur-xl rounded-3xl border border-yellow-300/40 shadow-2xl overflow-hidden"
        style={{ width: "100%", maxWidth: cols === 1 ? "480px" : cols === 2 ? "860px" : "1160px", maxHeight: "90vh" }}
      >
        {/* ── Header ── */}
        <div className="flex-shrink-0 px-6 py-3 bg-white/10 border-b border-white/15 text-center">
          <h2 className="text-lg font-extrabold text-yellow-300 tracking-wide animate-pulse">
            🏆 {electionTitle} — Results
          </h2>
        </div>

        {/* ── Results grid ── */}
        <div
          className="flex-1 grid gap-4 p-4 overflow-hidden"
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${Math.ceil(results.length / cols)}, minmax(0, 1fr))`,
          }}
        >
          {results.map((category, index) => {
            const sorted = [...category.nominees].sort((a, b) => b.votes - a.votes);
            const winner = sorted[0];

            return (
              <div
                key={index}
                className="flex flex-col bg-white/15 border border-white/20 rounded-2xl overflow-hidden"
              >
                {/* Category title strip */}
                <div className="flex-shrink-0 bg-white/10 px-4 py-1.5 border-b border-white/15">
                  <h3 className="text-xs font-bold text-center text-purple-200 tracking-widest uppercase">
                    {category.title}
                  </h3>
                </div>

                {/* Nominee rows — fill remaining space evenly */}
                <div className="flex-1 flex flex-col gap-2 p-3">
                  {sorted.map((nominee, idx) => {
                    const isWinner = nominee.name === winner.name;
                    return (
                      <div
                        key={idx}
                        className={`flex-1 flex items-center justify-between gap-2 px-3 rounded-xl text-gray-900 font-semibold text-sm transition-all duration-200
                          ${isWinner
                            ? "bg-gradient-to-r from-yellow-400 to-orange-400 ring-2 ring-yellow-300 shadow-[0_0_12px_rgba(251,191,36,0.5)]"
                            : "bg-white/30 text-white"
                          }`}
                      >
                        {/* Left: rank + photo + name */}
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-xs font-black opacity-60 w-4 flex-shrink-0">
                            {isWinner ? "🥇" : `#${idx + 1}`}
                          </span>
                          {nominee.photo && nominee.photo !== "/loading.png" && (
                            <Image
                              src={nominee.photo}
                              alt={nominee.name}
                              width={28}
                              height={28}
                              className="rounded-full object-cover flex-shrink-0 ring-1 ring-white/50"
                            />
                          )}
                          {nominee.logo && nominee.logo !== "/loading.png" && (
                            <Image
                              src={nominee.logo}
                              alt={`${nominee.name} logo`}
                              width={24}
                              height={24}
                              className="rounded-full object-cover flex-shrink-0"
                            />
                          )}
                          <span className="truncate">{nominee.name}</span>
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
