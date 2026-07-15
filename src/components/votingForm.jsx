import { useState } from "react";
import CategoryCard from "./categoryCard";

export default function VotingForm({
  categories,
  selectedNominees,
  handleSelectNominee,
  handleSubmit,
  voterCount,
  isSubmitting,
}) {
  return (
    <form
      action={handleSubmit}
      className="w-full flex flex-col max-w-6xl mx-auto"
    >
      {/* ── Category grid ────────────────────────────── */}
      {(() => {
        const sorted = [...categories].sort((a, b) => {
          const getOrder = (title) => {
            const t = title.toLowerCase().replace(/[^a-z]/g, '');
            if (t.includes("upheadboy") || (t.includes("up") && t.includes("headboy"))) return 1;
            if (t.includes("upheadgirl") || (t.includes("up") && t.includes("headgirl"))) return 2;
            if (t.includes("highheadboy") || (t.includes("high") && t.includes("headboy"))) return 3;
            if (t.includes("highheadgirl") || (t.includes("high") && t.includes("headgirl"))) return 4;
            if (t.includes("artsconv") || t.includes("artsclub") || t.includes("arts")) return 5;
            if (t.includes("magazine")) return 6;
            if (t.includes("sport")) return 7;
            if (t.includes("headboy")) return 8;
            if (t.includes("headgirl")) return 9;
            return 10;
          };
          return getOrder(a.title) - getOrder(b.title);
        });

        const isOdd = sorted.length % 2 !== 0;

        return (
          <div className="grid grid-cols-2 gap-4 p-2">
            {sorted.map((category, index) => {
              const isLastAndAlone = isOdd && index === sorted.length - 1;
              return (
                <div
                  key={index}
                  className={isLastAndAlone ? "col-span-2 flex justify-center" : ""}
                >
                  <div className={isLastAndAlone ? "w-[calc(50%-0.5rem)]" : "w-full h-full"}>
                    <CategoryCard
                      category={category}
                      selectedNominees={selectedNominees}
                      handleSelectNominee={handleSelectNominee}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        );
      })()}

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