import React, { useState } from 'react';
import type { SchoolData } from '../data';

interface Props {
  school: SchoolData;
  mode?: 'overall' | 'exam';
}

const Sunflower: React.FC<Props> = ({ school, mode = 'overall' }) => {
  const [isHovered, setIsHovered] = useState(false);

  const isExam = mode === 'exam';
  const stage = isExam ? (school.examStage || 1) : school.stage;
  const rate = isExam ? (school.examRate || 0) : school.rate;

  // 1-20のステージ番号からファイル名を生成
  const getImageUrl = (stageNum: number) => {
    const groupNum = Math.ceil(stageNum / 5);
    const indexInGroup = ((stageNum - 1) % 5) + 1;
    
    let groupStr = "";
    if (groupNum === 1) groupStr = "01to05";
    else if (groupNum === 2) groupStr = "06to10";
    else if (groupNum === 3) groupStr = "11to15";
    else groupStr = "16to20";

    return `${import.meta.env.BASE_URL}assets/sunflowers/stage${groupStr}_0${indexInGroup}.png`;
  };

  const imageUrl = getImageUrl(stage);

  return (
    <div 
      className={`sunflower-wrapper ${isHovered ? 'hover' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="sunflower-image-container">
        <img 
          src={imageUrl} 
          alt={`Stage ${stage}`} 
          className="sunflower-image"
        />
      </div>
      <div className="school-info">
        <span className="school-name" translate="no">{school.name}</span>
        <span className="school-rate">{rate.toFixed(1)}%</span>
      </div>

      <style>{`
        .sunflower-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          padding: 15px;
          width: 130px;
          min-height: 200px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.5);
          backdrop-filter: blur(12px);
          border: 2px solid rgba(255, 255, 255, 0.4);
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
        }
        .sunflower-wrapper:hover {
          transform: scale(1.05) translateY(-5px);
          background: rgba(255, 255, 255, 0.8);
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          z-index: 10;
        }
        .sunflower-image-container {
          width: 110px;
          height: 110px;
          position: relative;
          display: flex;
          align-items: center; 
          justify-content: center;
          overflow: hidden;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.3);
          margin-bottom: 5px;
        }
        .sunflower-image {
          width: 100%;
          height: 100%;
          object-fit: cover; /* containからcoverに変更してクローズアップを強調 */
          transition: all 0.5s ease-in-out;
          transform: scale(1.1); /* さらに少し拡大 */
        }
        .loading-placeholder {
          width: 100%;
          height: 100%;
          background: linear-gradient(110deg, #ececec 8%, #f5f5f5 18%, #ececec 33%);
          background-size: 200% 100%;
          animation: shine 1.5s linear infinite;
        }
        @keyframes shine {
          to { background-position-x: -200%; }
        }
        .school-info {
          margin-top: 8px;
          text-align: center;
          background: rgba(255, 255, 255, 0.8);
          padding: 2px 8px;
          border-radius: 10px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .school-name {
          display: block;
          font-weight: 700;
          font-size: 0.75rem;
          color: #5d4037;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .school-rate {
          display: block;
          font-size: 0.8rem;
          color: #388e3c;
          font-weight: 800;
        }
        }
      `}</style>
    </div>
  );
};

export default Sunflower;
