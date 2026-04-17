import { useState, useEffect, useMemo } from 'react';
import './App.css';
import type { SchoolData } from './data';
import { INITIAL_DATA, calculateStage } from './data';
import SunflowerField from './components/SunflowerField.tsx';
import TeamRanking from './components/TeamRanking.tsx';
import RankingPanel from './components/RankingPanel.tsx';
import { GOOGLE_SHEETS_CSV_URL, fetchAndUpdateData } from './utils/syncData';
import AdminMenu from './components/AdminMenu.tsx';
import { Settings, Sun, Cloud } from 'lucide-react';
import confetti from 'canvas-confetti';

function App() {
  // データは初期値からスタートし、マウント後に外部から取得する
  const [data, setData] = useState<SchoolData[]>(INITIAL_DATA);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [showRanking, setShowRanking] = useState(false);
  
  // URLハッシュによるタブ切り替え
  const [activeTab, setActiveTab] = useState<'farm' | 'team'>(() => {
    return window.location.hash === '#team' ? 'team' : 'farm';
  });

  useEffect(() => {
    const handleHashChange = () => {
      setActiveTab(window.location.hash === '#team' ? 'team' : 'farm');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // 初回ロード時に Google Sheets CSV 等からフェッチ
  useEffect(() => {
    const loadData = async () => {
      if (GOOGLE_SHEETS_CSV_URL) {
        const newData = await fetchAndUpdateData(INITIAL_DATA, GOOGLE_SHEETS_CSV_URL);
        updateData(newData);
      } else {
        updateData(INITIAL_DATA);
      }
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        <div className="tab-controls">
          <a 
            href="#farm" 
            className={`tab-btn ${activeTab === 'farm' ? 'active' : ''}`}
          >
            ひまわり畑
          </a>
          <a 
            href="#team" 
            className={`tab-btn ${activeTab === 'team' ? 'active' : ''}`}
          >
            チームランキング
          </a>
        </div>
        <button className="admin-btn" onClick={() => setIsAdminOpen(true)}>
          <Settings size={20} />
          <span>管理</span>
        </button>
      </header>

      <main className="content-area">
        {activeTab === 'farm' ? (
          <SunflowerField schools={data} />
        ) : (
          <TeamRanking schools={data} />
        )}
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
