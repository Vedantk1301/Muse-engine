import React from "react";
import { ClarificationOption } from "@/app/api";

type Props = {
  question: string;
  options: ClarificationOption[];
  onSelect: (id: string) => void;
};

const ClarificationCards: React.FC<Props> = ({ question, options, onSelect }) => {
  return (
    <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
        <p className="text-sm font-bold text-slate-200">Just to be sure I get this right...</p>
      </div>
      <p className="text-sm text-slate-400 mb-4 ml-3.5">{question}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((opt) => (
          <button
            key={opt.id}
            className="group flex flex-col items-start p-4 rounded-xl bg-slate-950/50 border border-slate-800 hover:border-sky-500/50 hover:bg-slate-900/80 transition-all duration-200 text-left"
            onClick={() => onSelect(opt.id)}
          >
            <div className="font-bold text-slate-200 group-hover:text-sky-300 transition-colors">
              {opt.label}
            </div>
            {opt.short_description && (
              <div className="text-xs text-slate-500 mt-1 group-hover:text-slate-400">
                {opt.short_description}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ClarificationCards;
