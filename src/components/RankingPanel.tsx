import React from 'react';
import type { SchoolData } from '../data';
import { Trophy, Minus } from 'lucide-react';

interface Props {
  schools: SchoolData[];
}

const RankingPanel: React.FC<Props> = ({ schools }) => {
  const rankedSchools = [...schools].sort((a, b) => b.rate - a.rate);

  return (
    <div className="ranking-panel">
      <div className="ranking-header">
        <Trophy className="icon-trophy" size={24} />
        <h2>ランキング</h2>
      </div>
      <div className="ranking-list">
        {rankedSchools.map((school, index) => {
          const rank = index + 1;
          const isTop3 = rank <= 3;
          
          return (
            <div key={school.id} className={`ranking-item rank-${rank} ${isTop3 ? 'top-rank' : ''}`}>
              <div className="rank-number">
                {isTop3 ? (
                  <span className="medal">{rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}</span>
                ) : (
                  rank
                )}
              </div>
              <div className="ranking-details">
                <span className="school-name">{school.name}</span>
                <div className="ranking-stats">
                  <span className="rate-badge">{school.rate.toFixed(1)}%</span>
                  <div className="movement-icon">
                    {/* Simplified movement placeholder */}
                    <Minus size={14} color="#999" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .ranking-panel {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: #fff;
        }
        .ranking-header {
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          border-bottom: 2px solid #f0f0f0;
          background: #fafafa;
        }
        .ranking-header h2 {
          margin: 0;
          font-size: 1.25rem;
          color: #5d4037;
        }
        .icon-trophy {
          color: #ffb300;
        }
        .ranking-list {
          flex: 1;
          overflow-y: auto;
          padding: 10px;
        }
        .ranking-item {
          display: flex;
          align-items: center;
          padding: 12px 15px;
          margin-bottom: 8px;
          border-radius: 12px;
          background: #fff;
          border: 1px solid #eee;
          transition: transform 0.2s;
        }
        .ranking-item:hover {
          transform: translateX(-5px);
          border-color: #ffb300;
        }
        .top-rank {
          background: linear-gradient(90deg, #fff9c4 0%, #fff 100%);
          border-color: #ffeb3b;
        }
        .rank-number {
          width: 40px;
          font-weight: 800;
          font-size: 1.1rem;
          color: #9e9e9e;
          display: flex;
          justify-content: center;
        }
        .rank-1 .rank-number { color: #fbc02d; font-size: 1.5rem; }
        .ranking-details {
          flex: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .ranking-details .school-name {
          font-weight: 600;
          color: #4e342e;
        }
        .ranking-stats {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .rate-badge {
          background: #e8f5e9;
          color: #2e7d32;
          padding: 2px 8px;
          border-radius: 20px;
          font-weight: 700;
          font-size: 0.85rem;
        }
        .medal {
          font-size: 1.5rem;
        }
      `}</style>
    </div>
  );
};

export default RankingPanel;
