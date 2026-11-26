"use client";

import { Check } from "lucide-react";
import { STEP_NAMES } from "@/constants/pbl";

interface StepperProps {
  currentStep: number;
  isStepDone: (step: number) => boolean;
  onSelectStep: (step: number) => void;
}

export function Stepper({ currentStep, isStepDone, onSelectStep }: StepperProps) {
  return (
    <nav
      aria-label="Langkah PBL"
      className="sticky top-0 z-20 flex gap-1.5 overflow-x-auto bg-slate-50/95 py-3 backdrop-blur-xs dark:bg-slate-950/95"
    >
      {STEP_NAMES.map((name, idx) => {
        const stepNum = idx + 1;
        const active = currentStep === stepNum;
        const done = isStepDone(stepNum);

        return (
          <button
            key={stepNum}
            onClick={() => onSelectStep(stepNum)}
            aria-current={active ? "step" : undefined}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
              active
                ? "border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900"
                : done
                ? "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-300"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            <span className="font-mono text-[11px] opacity-80">
              {done ? <Check className="h-3.5 w-3.5" /> : `0${stepNum}`}
            </span>
            <span>{name}</span>
          </button>
        );
      })}
    </nav>
  );
}