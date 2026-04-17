import React from 'react';
import type { SchoolData } from '../data';
import SunflowerField from './SunflowerField';

interface Props {
  schools: SchoolData[];
  onSchoolClick?: (schoolId: string) => void;
}

const TeamRanking: React.FC<Props> = ({ schools }) => {
  // チームごとの集計
  const teamsMap = new Map<string, { target: number; achievement: number; schools: SchoolData[] }>();
  
  schools.forEach(school => {
    const teamName = school.team || 'その他';
    if (!teamsMap.has(teamName)) {
      teamsMap.set(teamName, { target: 0, achievement: 0, schools: [] });
    }
    const t = teamsMap.get(teamName)!;
    t.target += school.target;
    t.achievement += school.achievement;
    t.schools.push(school);
  });

  const teamList = Array.from(teamsMap.entries()).map(([name, data]) => {
    const rate = data.target > 0 ? (data.achievement / data.target) * 100 : 0;
    let stage = Math.floor(rate / 5) + 1;
    if (rate >= 100) stage = 20;
    else if (rate <= 0) stage = 1;
    else stage = Math.min(stage, 19);

    return { name, rate, stage, data };
  }).sort((a, b) => b.rate - a.rate); // 達成率の降順でソート

  // 背景画像取得ロジック（Sunflower.tsxのものを流用）
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

  const [selectedTeam, setSelectedTeam] = React.useState<string>(teamList[0]?.name || '');

  // 選択されているチームが変わるケースのハンドリング
  React.useEffect(() => {
    if (!selectedTeam && teamList.length > 0) {
      setSelectedTeam(teamList[0].name);
    }
  }, [teamList, selectedTeam]);

  const activeTeamData = teamList.find(t => t.name === selectedTeam);

  return (
    <div className="team-ranking-container">
      <div className="team-cards-row">
        {teamList.map((team, index) => (
          <div 
            key={team.name} 
            className={`team-card ${selectedTeam === team.name ? 'active' : ''}`}
            onClick={() => setSelectedTeam(team.name)}
          >
            <div className="team-card-bg" style={{ backgroundImage: `url(${getImageUrl(team.stage)})` }}></div>
            <div className="team-card-content">
              <div className="rank-badge">{index + 1}位</div>
              <h3 className="team-name">{team.name}</h3>
              <div className="team-rate">{team.rate.toFixed(1)}<span className="percent">%</span></div>
              
              <div className="progress-container">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${Math.min(team.rate, 100)}%` }}></div>
                </div>
              </div>
              
              <div className="team-meta">
                {team.data.schools.length} 教室
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="team-schools-area">
        {activeTeamData && (
          <div className="team-schools-header">
            <h3>{activeTeamData.name} の所属教室</h3>
            <span className="avg-badge">
              チーム達成率 {activeTeamData.rate.toFixed(1)}%
            </span>
          </div>
        )}
        {activeTeamData ? (
          <SunflowerField schools={activeTeamData.data.schools} />
        ) : (
          <p>チームがありません</p>
        )}
      </div>

      <style>{`
        .team-ranking-container {
          padding: 20px;
          height: 100%;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .team-cards-row {
          display: flex;
          gap: 20px;
          overflow-x: auto;
          padding-bottom: 10px;
        }

        .team-card {
          position: relative;
          min-width: 200px;
          height: 240px;
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

        .team-card:hover .team-card-bg {
          filter: brightness(0.7) blur(0px);
        }

        .team-card-content {
          position: relative;
          z-index: 2;
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: white;
          text-shadow: 0 2px 4px rgba(0,0,0,0.4);
        }

        .rank-badge {
          background: linear-gradient(135deg, #FFD700 0%, #F57F17 100%);
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-weight: 900;
          font-size: 1.1rem;
          margin-bottom: 15px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
          border: 1px solid rgba(255,255,255,0.4);
        }

        .team-name {
          margin: 0 0 10px 0;
          font-size: 1.2rem;
        }

        .team-rate {
          font-size: 2.5rem;
          font-weight: 900;
          margin-bottom: 10px;
        }

        .team-rate .percent {
          font-size: 1.2rem;
          margin-left: 2px;
        }

        .progress-container {
          width: 100%;
          background: rgba(255,255,255,0.3);
          border-radius: 10px;
          height: 8px;
          margin-bottom: 10px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: #4caf50;
          border-radius: 10px;
          transition: width 1s ease-out;
        }

        .team-meta {
          font-size: 0.9rem;
          opacity: 0.9;
        }

        .team-schools-area {
          background: rgba(255, 255, 255, 0.9);
          border-radius: 20px;
          padding: 20px;
          flex: 1;
        }

        .team-schools-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 2px dashed #ddd;
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

export default TeamRanking;
