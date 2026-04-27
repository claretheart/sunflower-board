import React, { useRef } from 'react';
import type { SchoolData } from '../data';
import SunflowerField from './SunflowerField';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface Props {
  schools: SchoolData[];
  onSchoolClick?: (schoolId: string) => void;
  mode?: 'overall' | 'exam';
}

const AreaRanking: React.FC<Props> = ({ schools, mode = 'overall' }) => {
  const isExam = mode === 'exam';
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // エリアごとの集計
  const areasMap = new Map<string, { target: number; achievement: number; schools: SchoolData[] }>();
  
  schools.forEach(school => {
    if (!school.area) return;
    const areaName = school.area;
    
    if (!areasMap.has(areaName)) {
      areasMap.set(areaName, { target: 0, achievement: 0, schools: [] });
    }
    const a = areasMap.get(areaName)!;
    a.target += isExam ? (school.examTarget || 0) : school.target;
    a.achievement += isExam ? (school.examAchievement || 0) : school.achievement;
    a.schools.push(school);
  });

  const areaList = Array.from(areasMap.entries()).map(([name, data]) => {
    const rate = data.target > 0 ? (data.achievement / data.target) * 100 : 0;
    let stage = Math.floor(rate / 5) + 1;
    if (rate >= 100) stage = 20;
    else if (rate <= 0) stage = 1;
    else stage = Math.min(stage, 19);

    return { name, rate, stage, data };
  }).sort((a, b) => b.rate - a.rate); // 達成率の降順でソート

  // 背景画像取得ロジック
  const getImageUrl = (stage: number) => {
    const groupNum = Math.ceil(stage / 5);
    const indexInGroup = ((stage - 1) % 5) + 1;
    let groupStr = "";
    if (groupNum === 1) groupStr = "01to05";
    else if (groupNum === 2) groupStr = "06to10";
    else if (groupNum === 3) groupStr = "11to15";
    else groupStr = "16to20";
    return `${import.meta.env.BASE_URL}assets/sunflowers/stage${groupStr}_0${indexInGroup}.png`;
  };

  const [selectedArea, setSelectedArea] = React.useState<string>(areaList[0]?.name || '');

  React.useEffect(() => {
    if (!selectedArea && areaList.length > 0) {
      setSelectedArea(areaList[0].name);
    }
  }, [areaList, selectedArea]);

  const activeAreaData = areaList.find(a => a.name === selectedArea);

  const [showLeftArrow, setShowLeftArrow] = React.useState(false);
  const [showRightArrow, setShowRightArrow] = React.useState(true);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 20);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 20);
    }
  };

  React.useEffect(() => {
    handleScroll(); // 初期チェック
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', handleScroll);
      return () => {
        el.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleScroll);
      };
    }
  }, [areaList]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="team-ranking-container area-ranking-container">
      <div className="cards-slider-wrapper">
        {showLeftArrow && (
          <button className="scroll-arrow scroll-left" onClick={() => scroll('left')}>
            <ChevronLeft size={32} />
          </button>
        )}
        
        <div className="team-cards-row" ref={scrollRef}>
          {areaList.map((area, index) => (
            <div 
              key={area.name} 
              className={`team-card ${selectedArea === area.name ? 'active' : ''}`}
              onClick={() => setSelectedArea(area.name)}
            >
                <div className="team-card-bg" style={{ backgroundImage: `url(${getImageUrl(area.stage)})` }}></div>
                <div className="team-card-content">
                <div className="rank-badge">
                  {index + 1}位
                </div>
                <h3 className="team-name" translate="no">{area.name}</h3>
                <div className="team-rate">{area.rate.toFixed(1)}<span className="percent">%</span></div>
                
                <div className="progress-container">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${Math.min(area.rate, 100)}%` }}></div>
                  </div>
                </div>
                
                <div className="team-meta">
                  {area.data.schools.length} 教室
                </div>
              </div>
            </div>
          ))}
        </div>

        {showRightArrow && (
          <button className="scroll-arrow scroll-right" onClick={() => scroll('right')}>
            <ChevronRight size={32} />
          </button>
        )}
      </div>

      <div className="team-schools-area">
        {activeAreaData && (
          <div className="team-schools-header">
            <h3 translate="no">{activeAreaData.name} の所属教室</h3>
            <span className="avg-badge">
              エリア達成率 {activeAreaData.rate.toFixed(1)}%
            </span>
          </div>
        )}
        {activeAreaData ? (
          <SunflowerField schools={activeAreaData.data.schools} compact={true} mode={mode} />
        ) : (
          <p>エリアデータがありません</p>
        )}
      </div>

      <style>{`
        .area-ranking-container {
          padding: 20px;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 20px;
          overflow-y: auto;
          min-height: 0;
        }

        .cards-slider-wrapper {
          position: relative;
          padding: 0 30px;
          margin-bottom: 10px;
        }

        .team-cards-row {
          display: flex;
          gap: 20px;
          overflow-x: auto;
          padding: 15px 5px 25px 5px;
          flex-shrink: 0;
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
        }
        
        .team-cards-row::-webkit-scrollbar {
          height: 12px;
          display: block;
        }
        .team-cards-row::-webkit-scrollbar-track {
          background: #f0f0f0;
          border-radius: 10px;
          box-shadow: inset 0 0 5px rgba(0,0,0,0.1);
        }
        .team-cards-row::-webkit-scrollbar-thumb {
          background: #777;
          border-radius: 10px;
          border: 3px solid rgba(255,255,255,0.8);
        }
        .team-cards-row::-webkit-scrollbar-thumb:hover {
          background: #555;
        }

        .scroll-arrow {
          position: absolute;
          top: calc(50% - 12px);
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(255, 179, 0, 0.3);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(0,0,0,0.15);
          color: #ffb300;
          transition: all 0.2s;
          z-index: 20;
        }
        .scroll-left { left: -5px; }
        .scroll-right { right: -5px; }
        
        .scroll-arrow:hover {
          background: #fff;
          transform: translateY(-50%) scale(1.1);
          box-shadow: 0 6px 20px rgba(0,0,0,0.2);
          border-color: #ffb300;
        }

        .team-card {
          position: relative;
          min-width: 170px;
          height: 250px;
          border-radius: 16px;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          border: 3px solid transparent;
        }

        .team-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }

        .team-card.active {
          border-color: #ffb300;
          box-shadow: 0 0 20px rgba(255, 179, 0, 0.4);
          transform: scale(1.02);
        }

        .team-card-bg {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background-size: cover;
          background-position: center;
          filter: brightness(0.6) blur(2px);
          transform: scale(1.1);
          transition: all 0.3s;
          z-index: 1;
        }

        .team-card-content {
          position: relative;
          z-index: 10;
          padding: 15px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          height: 100%;
          color: white;
          text-shadow: 0 2px 4px rgba(0,0,0,0.4);
        }

        .rank-badge {
          background: linear-gradient(135deg, #FFD700 0%, #F57F17 100%);
          color: white;
          padding: 4px 10px;
          border-radius: 20px;
          font-weight: 900;
          font-size: 0.9rem;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
          border: 1px solid rgba(255,255,255,0.4);
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .team-name {
          margin: 5px 0;
          font-size: 0.95rem;
          line-height: 1.2;
          text-align: center;
          max-width: 100%;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 2.3rem;
        }

        .team-rate {
          font-size: 2.1rem;
          font-weight: 900;
        }

        .team-rate .percent {
          font-size: 0.9rem;
        }

        .progress-container {
          width: 100%;
          background: rgba(255,255,255,0.3);
          border-radius: 10px;
          height: 6px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: #4caf50;
          border-radius: 10px;
          transition: width 1s ease-out;
        }

        .team-meta {
          font-size: 0.8rem;
          opacity: 0.9;
        }

        .team-schools-area {
          background: rgba(255, 255, 255, 0.9);
          border-radius: 20px;
          padding: 15px 20px;
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 0;
        }

        .team-schools-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 2px dashed #ddd;
          flex-shrink: 0;
        }

        .team-schools-header h3 {
          margin: 0;
          color: #5d4037;
          font-size: 1.4rem;
        }

        .avg-badge {
          background: #e8f5e9;
          color: #2e7d32;
          padding: 6px 12px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.9rem;
        }

      `}</style>
    </div>
  );
};

export default AreaRanking;
