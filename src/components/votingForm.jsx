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
  const [activeStep, setActiveStep] = useState(0);

  const sortedCategories = [...categories].sort((a, b) => {
    const getOrder = (title) => {
      const t = title.toLowerCase().replace(/[^a-z]/g, '');
      if (t.includes("headboy")) return 1;
      if (t.includes("headgirl")) return 2;
      if (t.includes("sportsclub")) return 3;
      if (t.includes("artsclub")) return 4;
      return 5;
    };
    return getOrder(a.title) - getOrder(b.title);
  });

  const currentCategory = sortedCategories[activeStep];
  const isLastStep = activeStep === sortedCategories.length - 1;

  // Validation: check if nominee is selected in the current category
  const hasSelectedCurrent = currentCategory && !!selectedNominees[currentCategory.title];

  const handleNext = () => {
    if (activeStep < sortedCategories.length - 1) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(prev => prev - 1);
    }
  };

  return (
    <form
      action={handleSubmit}
      className="flex-1 w-full flex flex-col justify-between max-w-2xl mx-auto px-2"
    >
      {/* ── Progress & Category Step Indicator ────────────────────────────── */}
      {sortedCategories.length > 0 && (
        <div className="flex-shrink-0 flex flex-col items-center gap-1.5 mb-2">
          <div className="text-xs font-semibold text-white/70 uppercase tracking-wider">
            Step {activeStep + 1} of {sortedCategories.length}
          </div>
          <div className="flex gap-1.5 w-full justify-center">
            {sortedCategories.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === activeStep 
                    ? "w-8 bg-yellow-400" 
                    : index < activeStep 
                      ? "w-4 bg-green-400" 
                      : "w-4 bg-white/20"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Active Category Card ────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center py-2 overflow-y-auto custom-scrollbar">
        {currentCategory && (
          <CategoryCard
            category={currentCategory}
            selectedNominees={selectedNominees}
            handleSelectNominee={handleSelectNominee}
          />
        )}
      </div>

      {/* ── Footer / Navigation Bar ───────────────────────────────── */}
      <div className="flex-shrink-0 flex flex-col gap-3 pt-4 border-t border-white/10 mt-2">
        <div className="flex items-center justify-between gap-4">
          {/* Back Button */}
          <button
            type="button"
            onClick={handleBack}
            disabled={activeStep === 0}
            className="px-6 py-2 rounded-full font-bold border border-white/20 bg-white/5 hover:bg-white/15 text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed text-sm"
          >
            Back
          </button>

          {/* Next or Submit Button */}
          {isLastStep ? (
            <button
              type="submit"
              disabled={isSubmitting || !hasSelectedCurrent}
              className="bg-gradient-to-r from-green-400 to-teal-400 text-gray-900 px-8 py-2 rounded-full font-bold hover:from-green-300 hover:to-teal-300 transition-all duration-300 hover:scale-105 disabled:opacity-55 disabled:cursor-not-allowed text-sm shadow-lg"
              aria-label="Submit all votes"
            >
              {isSubmitting ? "Submitting…" : "Submit Votes"}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              disabled={!hasSelectedCurrent}
              className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-8 py-2 rounded-full font-bold transition-all duration-300 hover:scale-105 disabled:opacity-55 disabled:cursor-not-allowed text-sm shadow-md"
            >
              Next Category
            </button>
          )}
        </div>

        {/* Voter count badge & instruction message */}
        <div className="flex items-center justify-between text-xs text-white/60">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span>{voterCount} {voterCount === 1 ? "vote" : "votes"} cast</span>
          </div>
          {!hasSelectedCurrent && (
            <span className="text-yellow-300/80 animate-pulse">Select a candidate to proceed</span>
          )}
        </div>
      </div>
    </form>
  );
}