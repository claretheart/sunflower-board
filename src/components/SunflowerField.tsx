import React from 'react';
import type { SchoolData } from '../data';
import Sunflower from './Sunflower.tsx';

interface Props {
  schools: SchoolData[];
}

const SunflowerField: React.FC<Props> = ({ schools }) => {
  // Sort schools by region/ID to keep consistent layout
  const sortedSchools = [...schools].sort((a, b) => a.id.localeCompare(b.id));

  return (
    <div className="sunflower-field">
      <div className="field-grid">
        {sortedSchools.map((school) => (
          <Sunflower key={school.id} school={school} />
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
          z-index: 20;
        }
        .field-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
          gap: 30px;
          width: 100%;
          max-width: 1400px;
        }
      `}</style>
    </div>
  );
};

export default SunflowerField;
