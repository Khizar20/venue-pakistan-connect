import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const CustomSelect = ({ 
  options, 
  value, 
  onChange, 
  placeholder = "Select an option",
  className = "",
  disabled = false
}: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const selectRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const selectedOption = options.find(option => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && highlightedIndex >= 0) {
      optionRefs.current[highlightedIndex]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      });
    }
  }, [highlightedIndex, isOpen]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (isOpen && highlightedIndex >= 0) {
          onChange(options[highlightedIndex].value);
          setIsOpen(false);
        } else {
          setIsOpen(!isOpen);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex(prev => 
            prev < options.length - 1 ? prev + 1 : 0
          );
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex(prev => 
            prev > 0 ? prev - 1 : options.length - 1
          );
        }
        break;
    }
  };

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const handleMouseEnter = (index: number) => {
    setHighlightedIndex(index);
  };

  return (
    <div 
      ref={selectRef}
      className={`relative ${className}`}
    >
      {/* Select Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={`
          w-full px-4 py-3 text-left bg-background border-2 border-border rounded-lg
          transition-all duration-200 cursor-pointer
          ${disabled 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:border-beige/60 hover:bg-secondary/30 hover:-translate-y-0.5 hover:shadow-md'
          }
          ${isOpen 
            ? 'border-beige bg-background shadow-lg' 
            : 'focus:border-beige focus:shadow-lg focus:outline-none'
          }
        `}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        role="combobox"
        aria-label={placeholder}
      >
        <div className="flex items-center justify-between">
          <span className={`${selectedOption ? 'text-foreground' : 'text-muted-foreground'}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown 
            className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`} 
          />
        </div>
      </button>

      {/* Dropdown Options */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-1 bg-background border-2 border-border rounded-lg shadow-lg max-h-60 overflow-y-auto"
            role="listbox"
          >
            {options.map((option, index) => (
              <div
                key={option.value}
                ref={el => optionRefs.current[index] = el}
                onClick={() => handleOptionClick(option.value)}
                onMouseEnter={() => handleMouseEnter(index)}
                className={`
                  px-4 py-3 cursor-pointer transition-all duration-150 flex items-center justify-between
                  ${index === highlightedIndex 
                    ? 'bg-beige/20 text-primary border-l-4 border-beige' 
                    : 'hover:bg-beige/10 hover:text-primary'
                  }
                  ${option.value === value 
                    ? 'bg-beige/30 text-primary font-medium' 
                    : 'text-foreground'
                  }
                `}
                role="option"
                aria-selected={option.value === value}
              >
                <span>{option.label}</span>
                {option.value === value && (
                  <Check className="h-4 w-4 text-beige" />
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomSelect;
