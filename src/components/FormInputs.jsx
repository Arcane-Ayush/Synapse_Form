import React from 'react';
import { AlertCircle, Terminal } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...classes) => twMerge(clsx(classes));

export const FieldWrapper = ({ label, error, required, children, description }) => (
  <div className="interactive-card animate-slide-up">
    <div className="interactive-card-inner relative z-10 flex flex-col">
      {label && (
        <label className="block text-base md:text-lg font-medium text-zinc-200 mb-2">
          {label} {required && <span className="text-purple-400 ml-1">*</span>}
        </label>
      )}
      {description && <p className="text-zinc-500 text-sm md:text-base mb-3 font-light">{description}</p>}
      {children}
      {error && (
        <div className="mt-3 flex items-center text-red-400 text-base animate-fade-in bg-red-500/10 p-2 rounded-md">
          <AlertCircle className="w-4 h-4 mr-2" />
          <span className="font-light">{error}</span>
        </div>
      )}
    </div>
  </div>
);

export const TextInput = ({ label, error, required, description, className, ...props }) => {
  return (
    <FieldWrapper label={label} error={error} required={required} description={description}>
      <input
        className={cn(
          "premium-input w-full px-4 py-3 rounded-lg text-base md:text-lg placeholder-zinc-600 focus:ring-0",
          error ? "border-red-500/50" : "",
          className
        )}
        {...props}
      />
    </FieldWrapper>
  );
};

export const TextArea = ({ label, error, required, description, className, ...props }) => {
  return (
    <FieldWrapper label={label} error={error} required={required} description={description}>
      <textarea
        className={cn(
          "premium-input w-full px-4 py-3 rounded-lg text-base md:text-lg min-h-[120px] resize-y placeholder-zinc-600 focus:ring-0",
          error ? "border-red-500/50" : "",
          className
        )}
        {...props}
      />
    </FieldWrapper>
  );
};

export const CheckboxGroup = ({ label, error, required, description, options, selectedValues, onChange, variant = 'list', gridClassName }) => {
  const handleToggle = (optionValue) => {
    if (selectedValues.includes(optionValue)) {
      onChange(selectedValues.filter(v => v !== optionValue));
    } else {
      onChange([...selectedValues, optionValue]);
    }
  };

  return (
    <FieldWrapper label={label} error={error} required={required} description={description}>
      {variant === 'list' ? (
        <div className="space-y-1 mt-1">
          {options.map((option) => (
            <label key={option.value} className="checkbox-row flex items-start space-x-4 cursor-pointer group">
              <div className="relative flex items-center justify-center mt-0.5">
                <input
                  type="checkbox"
                  className="premium-checkbox"
                  checked={selectedValues.includes(option.value)}
                  onChange={() => handleToggle(option.value)}
                />
              </div>
              <span className="text-zinc-400 text-base md:text-lg group-hover:text-white transition-colors font-medium mt-0.5">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      ) : (
        <div className={cn("bento-grid", gridClassName)}>
          {options.map((option) => {
            const isSelected = selectedValues.includes(option.value);
            return (
              <label
                key={option.value}
                className={cn(
                  "cursor-pointer group relative overflow-hidden transition-all duration-300 rounded-md",
                  "bg-zinc-900 border border-white/10 hover:border-white/30",
                  isSelected ? "shadow-[0_0_20px_rgba(147,51,234,0.3)] ring-2 ring-purple-500 z-10" : "hover:bg-zinc-800",
                  option.bentoClass || "",
                  "flex flex-row md:flex-col items-center md:items-stretch"
                )}
                onClick={(e) => {
                  if (e.target.tagName !== 'INPUT') {
                    // prevent double trigger
                  }
                }}
              >
                <div className="relative w-1/3 md:w-full h-24 md:h-auto md:flex-grow bg-black flex items-center justify-center overflow-hidden flex-shrink-0">
                  {option.image || option.desktopImage ? (
                    <>
                      {option.image && (
                        <img src={option.image} alt={option.label} className={cn("w-full h-full object-cover transition-all duration-700 opacity-70", option.desktopImage ? "md:hidden block" : "", isSelected ? "scale-110 opacity-100" : "group-hover:scale-110 group-hover:opacity-90")} />
                      )}
                      {option.desktopImage && (
                        <img src={option.desktopImage} alt={option.label} className={cn("w-full h-full object-cover transition-all duration-700 opacity-70 hidden md:block", isSelected ? "scale-110 opacity-100" : "group-hover:scale-110 group-hover:opacity-90")} />
                      )}
                      <div className={cn("absolute inset-0 bg-gradient-to-t from-black/90 via-purple-900/30 to-purple-500/10 transition-opacity duration-500 mix-blend-overlay", isSelected ? "opacity-30" : "opacity-80 group-hover:opacity-50")} />
                      <div className={cn("absolute inset-0 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-500", isSelected ? "opacity-30" : "opacity-90 group-hover:opacity-60")} />
                    </>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-zinc-900 to-black flex items-center justify-center group-hover:from-zinc-800 transition-colors duration-500">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:bg-white/10 transition-all duration-500 group-hover:scale-110">
                        <Terminal className="w-8 h-8 md:w-10 md:h-10 text-zinc-400 group-hover:text-purple-400 transition-colors duration-500" />
                      </div>
                    </div>
                  )}
                  {/* Top left checkmark absolute */}
                  <div className="absolute top-2 left-2 md:top-3 md:left-3 z-10 flex items-center justify-center">
                    <input
                      type="checkbox"
                      className="premium-checkbox shadow-lg"
                      checked={isSelected}
                      onChange={() => handleToggle(option.value)}
                    />
                  </div>
                </div>
                <div className="w-2/3 md:w-full p-4 md:p-3 flex items-center justify-start md:justify-center text-left md:text-center md:absolute md:bottom-0 md:left-0 md:bg-zinc-900/95 md:border-t md:border-white/10">
                  <span className={cn("text-base md:text-lg font-medium transition-colors md:line-clamp-1", isSelected ? "text-purple-300" : "text-zinc-300 group-hover:text-white")}>
                    {option.label}
                  </span>
                </div>
              </label>
            );
          })}
        </div>
      )}
    </FieldWrapper>
  );
};
