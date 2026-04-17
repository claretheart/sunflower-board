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
          padding: 10px;
          overflow-y: visible;
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
          padding-bottom: 15px;
        }
        .sunflower-field.compact .sunflower-wrapper {
          transform: scale(0.85);
          transform-origin: top center;
          height: 190px;
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
};

export default SunflowerField;
