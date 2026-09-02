"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search, Check } from "lucide-react";

export interface DropdownOption {
  value: string;
  label: string;
  count?: number;
  icon?: ReactNode;
}

interface CustomFilterDropdownProps {
  id?: string;
  label: string;
  icon?: ReactNode;
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  allLabel?: string;
}

export default function CustomFilterDropdown({
  id,
  label,
  icon,
  value,
  options,
  onChange,
  searchable = false,
  searchPlaceholder = "Search...",
  allLabel = "All",
}: CustomFilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Focus search input on open
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
    if (!isOpen) {
      setSearch("");
    }
  }, [isOpen, searchable]);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayLabel = selectedOption ? selectedOption.label : allLabel;
  const isSelectedActive = value !== "All" && value !== "";

  const filteredOptions = searchable && search.trim()
    ? options.filter((opt) => opt.label.toLowerCase().includes(search.toLowerCase().trim()))
    : options;

  return (
    <div
      className={`custom-dropdown-container ${isOpen ? "is-open" : ""}`}
      ref={dropdownRef}
      id={id}
    >
      <button
        type="button"
        className={`custom-dropdown-trigger ${isOpen ? "open" : ""} ${isSelectedActive ? "has-value" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="dropdown-label-wrap">
          {icon && <span className="dropdown-icon">{icon}</span>}
          <span className="dropdown-field-title">{label}:</span>
          <span className="dropdown-current-value">{displayLabel}</span>
        </span>
        <motion.span
          className="dropdown-chevron"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          <ChevronDown size={15} />
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="custom-dropdown-menu"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            role="listbox"
          >
            {searchable && (
              <div className="dropdown-search-box">
                <Search size={14} className="dropdown-search-icon" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder={searchPlaceholder}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="dropdown-search-input"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}

            <div className="dropdown-options-scroller">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => {
                  const isSelected = opt.value === value;
                  return (
                    <button
                      type="button"
                      key={opt.value}
                      className={`dropdown-option-item ${isSelected ? "selected" : ""}`}
                      onClick={() => {
                        onChange(opt.value);
                        setIsOpen(false);
                      }}
                      role="option"
                      aria-selected={isSelected}
                    >
                      <span className="dropdown-option-text">
                        {opt.icon && <span className="option-icon">{opt.icon}</span>}
                        <span>{opt.label}</span>
                      </span>
                      <span className="dropdown-option-meta">
                        {opt.count !== undefined && opt.count > 0 && (
                          <span className="option-count-pill">{opt.count}</span>
                        )}
                        {isSelected && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="option-check-icon"
                          >
                            <Check size={13} />
                          </motion.span>
                        )}
                      </span>
                    </button>
                  );
                })
              ) : (
                <div className="dropdown-no-results">No options found</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
