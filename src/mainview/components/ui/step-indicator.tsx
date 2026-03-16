import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  currentStep: number;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const steps = [0, 1, 2, 3];
  
  return (
    <div className="flex items-center gap-1.5 animate-fade-up">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center gap-1.5">
          <div
            className={cn(
              "w-1.5 h-1.5 rounded-full transition-all duration-300",
              step === currentStep && "w-[18px] rounded-[3px]",
              step < currentStep ? "bg-[var(--ok)]" : step === currentStep ? "bg-[var(--o)] shadow-[0_0_6px_var(--o-glow)]" : "bg-white/10"
            )}
          />
          {index < steps.length - 1 && (
            <div
              className={cn(
                "w-[22px] h-px transition-all duration-350",
                step < currentStep ? "bg-[rgba(143,186,125,0.22)]" : "bg-white/[0.07]"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
