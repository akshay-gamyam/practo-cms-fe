import { useEffect, useRef, useState } from "react";

const CustomSelect = ({
  value,
  options = [],
  onChange,
  placeholder = "Select",
  renderOption,
  renderValue,
  disabled = false,
  className = "",
  dropdownClassName = "",
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((o) => o.value === value);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between gap-2
          text-sm px-4 py-1.5 border rounded-xl font-medium
          hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        <span className="truncate">
          {renderValue
            ? renderValue(selectedOption)
            : selectedOption?.label || placeholder}
        </span>

        <span className="text-xs">▾</span>
      </button>

      {open && (
        <div
          className={`absolute right-0 mt-2 w-full bg-white border rounded-lg shadow-lg z-50 ${dropdownClassName}`}
        >
          {options.length === 0 ? (
            <div className="px-4 py-2 text-sm text-gray-500">
              No options
            </div>
          ) : (
            options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value, option);
                  setOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100
                  ${
                    option.value === value
                      ? "bg-gray-100 font-semibold"
                      : ""
                  }`}
              >
                {renderOption ? renderOption(option) : option.label}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;