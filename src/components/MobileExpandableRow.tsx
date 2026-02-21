import { useState } from "react";
import type { ReactNode } from "react";

type MobileExpandableRowProps = {
  mainContent: ReactNode;
  expandedContent?: ReactNode;
  rightContent?: ReactNode;
};

export function MobileExpandableRow({ mainContent, expandedContent, rightContent }: MobileExpandableRowProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border-b border-stone-100 last:border-0">
      <div className="flex items-center gap-3 p-4">
        {expandedContent && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-stone-400 hover:text-stone-600 transition-colors"
            aria-label={expanded ? "Collapse" : "Expand"}
          >
            <svg
              className={`w-5 h-5 transition-transform ${expanded ? "rotate-90" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
        <div className="flex-1 min-w-0">{mainContent}</div>
        {rightContent && <div className="shrink-0">{rightContent}</div>}
      </div>
      {expanded && expandedContent && (
        <div className="px-4 pb-4 pl-12">{expandedContent}</div>
      )}
    </div>
  );
}
