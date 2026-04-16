import { useState, useEffect, useMemo } from 'react';
import './App.css';
import type { SchoolData } from './data';
import { INITIAL_DATA, calculateStage } from './data';
import SunflowerField from './components/SunflowerField.tsx';
import RankingPanel from './components/RankingPanel.tsx';
import AdminMenu from './components/AdminMenu.tsx';
import { Settings, Sun, Cloud } from 'lucide-react';
import confetti from 'canvas-confetti';

function App() {
  const [data, setData] = useState<SchoolData[]>(() => {
    const saved = localStorage.getItem('sunflower_data');
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [showRanking, setShowRanking] = useState(false);

  useEffect(() => {
    // 起動時に現在のロジックでステージを再計算し、0以下のステージを1以上に補正
    const validatedData = data.map(d => ({
      ...d,
      stage: calculateStage(d.rate)
    }));
    
    // データに変更がある場合のみ更新
    if (JSON.stringify(validatedData) !== JSON.stringify(data)) {
      setData(validatedData);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('sunflower_data', JSON.stringify(data));
  }, [data]);

  const stats = useMemo(() => {
    const totalAchieved = data.reduce((sum, d) => sum + d.achievement, 0);
    const totalTarget = data.reduce((sum, d) => sum + d.target, 0);
    const avgRate = (totalAchieved / totalTarget) * 100 || 0;
    const fullBloomCount = data.filter(d => d.rate >= 100).length;
    
    // Remaining days until June 30th (from current time provided)
    const now = new Date('2026-04-16T15:44:11');
    const end = new Date('2026-06-30T23:59:59');
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    return { avgRate, fullBloomCount, daysLeft: diff };
  }, [data]);

  const updateData = (newData: SchoolData[]) => {
    // Check for newly achieved 100%
    const newlyAchieved = newData.filter(newSchool => {
      const oldSchool = data.find(s => s.id === newSchool.id);
      const newRate = (newSchool.achievement / newSchool.target) * 100;
      return newRate >= 100 && (!oldSchool || oldSchool.rate < 100);
    });

    if (newlyAchieved.length > 0) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ffeb3b', '#fbc02d', '#4caf50', '#ffffff']
      });
    }

    setData(newData.map(d => {
      const rate = parseFloat(((d.achievement / d.target) * 100).toFixed(1));
      return {
        ...d,
        rate,
        stage: calculateStage(rate)
      };
    }));
  };

  return (
    <div className="app-main">
      <header className="app-header">
        <div className="logo">
          <Sun className="icon-sun" size={32} />
          <h1>ひまわり成長ボード 2026</h1>
        </div>
        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-label">全体平均達成率</span>
            <span className="stat-value">{stats.avgRate.toFixed(1)}%</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">満開の教室</span>
            <span className="stat-value">{stats.fullBloomCount} 教室</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">期間終了まで</span>
            <span className="stat-value">残り {stats.daysLeft} 日</span>
          </div>
        </div>
        <button className="admin-btn" onClick={() => setIsAdminOpen(true)}>
          <Settings size={20} />
          <span>管理</span>
        </button>
      </header>

      <main className="content-area">
        <SunflowerField schools={data} />
        <aside className={`side-panel ${showRanking ? 'open' : ''}`}>
          <button className="toggle-ranking" onClick={() => setShowRanking(!showRanking)}>
            {showRanking ? '◀ フィールド表示' : '▶ ランキング表示'}
          </button>
          <RankingPanel schools={data} />
        </aside>
      </main>

      {isAdminOpen && (
        <AdminMenu 
          data={data} 
          onUpdate={updateData} 
          onClose={() => setIsAdminOpen(false)} 
        />
      )}
      
      <div className="background-decoration">
        <Cloud className="cloud c1" size={100} />
        <Cloud className="cloud c2" size={150} />
      </div>
    </div>
  );
}

export default App;
