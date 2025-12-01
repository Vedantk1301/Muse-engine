import React from "react";

type Chip = {
  id: string;
  label: string;
};

type Props = {
  chips: Chip[];
  onSelect: (id: string) => void;
};

const RefinementChips: React.FC<Props> = ({ chips, onSelect }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((chip) => (
        <button
          key={chip.id}
          className="px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700 text-sm text-slate-300 hover:bg-sky-500/10 hover:border-sky-500/50 hover:text-sky-300 transition-all active:scale-95"
          onClick={() => onSelect(chip.id)}
        >
          {chip.label}
        </button>
      ))}
    </div>
  );
};

export default RefinementChips;
