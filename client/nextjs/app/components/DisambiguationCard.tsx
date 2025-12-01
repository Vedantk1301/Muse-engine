import React from "react";
/* eslint-disable @next/next/no-img-element */

type Option = {
  id: string;
  label: string;
  preview_url?: string;
};

type Props = {
  question: string;
  options: Option[];
  onSelect: (id: string) => void;
};

const DisambiguationCard: React.FC<Props> = ({ question, options, onSelect }) => {
  return (
    <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/50 shadow-xl">
      <div className="mb-3">
        <span className="text-xs font-bold text-sky-400 uppercase tracking-widest">Clarify</span>
        <p className="mt-1 text-base font-semibold text-slate-100">{question}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((option) => (
          <button
            key={option.id}
            className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/50 border border-slate-800 hover:border-sky-500/50 hover:bg-slate-900 transition-all text-left group"
            onClick={() => onSelect(option.id)}
          >
            {option.preview_url && (
              <img
                src={option.preview_url}
                alt={option.label}
                className="w-12 h-12 rounded-lg object-cover border border-slate-800 group-hover:border-slate-700"
              />
            )}
            <span className="font-medium text-slate-300 group-hover:text-sky-200 transition-colors">
              {option.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DisambiguationCard;
