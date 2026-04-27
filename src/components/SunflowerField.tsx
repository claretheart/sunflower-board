import React from 'react';
import type { SchoolData } from '../data';
import Sunflower from './Sunflower.tsx';

interface Props {
  schools: SchoolData[];
  compact?: boolean;
  mode?: 'overall' | 'exam';
}

const SunflowerField: React.FC<Props> = ({ schools, compact = false, mode = 'overall' }) => {
  // Sort schools by region/ID to keep consistent layout
  const sortedSchools = [...schools].sort((a, b) => a.id.localeCompare(b.id));

  return (
    <div className={`sunflower-field ${compact ? 'compact' : ''}`}>
      <div className="field-grid">
        {sortedSchools.map((school) => (
          <div className="sunflower-wrapper" key={school.id}>
            <Sunflower school={school} mode={mode} />
          </div>
        ))}
      </div>
      <style>{`
        .sunflower-field {
          flex: 1;
          overflow-y: auto;
          padding: 40px;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          z-index: 10;
        }
        .sunflower-field.compact {
          padding: 5px 10px 15px 10px;
          min-height: 210px;
          overflow: visible;
        }
        .field-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
          gap: 30px;
          width: 100%;
          max-width: 1400px;
        }
        .sunflower-field.compact .field-grid {
          display: flex;
          flex-wrap: nowrap;
          justify-content: flex-start;
          gap: 10px;
          overflow-x: auto;
          padding-bottom: 5px;
          -webkit-overflow-scrolling: touch;
        }
        
        .sunflower-field.compact .field-grid::-webkit-scrollbar {
          height: 12px;
          display: block;
        }
        .sunflower-field.compact .field-grid::-webkit-scrollbar-track {
          background: #f0f0f0;
          border-radius: 10px;
          box-shadow: inset 0 0 5px rgba(0,0,0,0.1);
        }
        .sunflower-field.compact .field-grid::-webkit-scrollbar-thumb {
          background-color: #777;
          border-radius: 10px;
          border: 3px solid rgba(255,255,255,0.8);
        }
        .sunflower-field.compact .field-grid::-webkit-scrollbar-thumb:hover {
          background-color: #555;
        }

        .sunflower-field.compact .sunflower-wrapper {
          transform: scale(0.85);
          transform-origin: top center;
          height: 190px;
          flex-shrink: 0;
        }
        @media print {
          .sunflower-field {
            padding: 20px !important;
            overflow: visible !important;
          }
          .field-grid {
            grid-template-columns: repeat(8, 1fr) !important;
            gap: 12px 8px !important;
            max-width: none !important;
          }
          .sunflower-wrapper {
            transform: scale(0.8) !important;
            height: 140px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SunflowerField;
