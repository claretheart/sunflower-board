import { useState, useEffect, useMemo } from 'react';
import './App.css';
import type { SchoolData } from './data';
import { INITIAL_DATA, calculateStage } from './data';
import SunflowerField from './components/SunflowerField.tsx';
import TeamRanking from './components/TeamRanking.tsx';
import AreaRanking from './components/AreaRanking.tsx';
import RankingPanel from './components/RankingPanel.tsx';
import { GOOGLE_SHEETS_CSV_URL, fetchAndUpdateData } from './utils/syncData';
import { Sun, Cloud } from 'lucide-react';

function App() {
  // データは初期値からスタートし、マウント後に外部から取得する
  const [data, setData] = useState<SchoolData[]>(INITIAL_DATA);

  const [showRanking, setShowRanking] = useState(false);
  
  // URLハッシュによるタブ切り替え
  type TabType = 'farm' | 'team' | 'area' | 'exam-farm' | 'exam-team' | 'exam-area';
  const [activeTab, setActiveTab] = useState<TabType>(() => {
    const hash = window.location.hash.replace('#', '');
    if (['farm', 'team', 'area', 'exam-farm', 'exam-team', 'exam-area'].includes(hash)) {
      return hash as TabType;
    }
    return 'farm';
  });
  
  const mode: 'overall' | 'exam' = activeTab.includes('exam') ? 'exam' : 'overall';

  const updateData = (newData: SchoolData[]) => {
    setData(newData.map(d => {
      const rate = d.target > 0 ? parseFloat(((d.achievement / d.target) * 100).toFixed(1)) : 0;
      const examRate = (d.examTarget && d.examTarget > 0) ? parseFloat((((d.examAchievement || 0) / d.examTarget) * 100).toFixed(1)) : 0;
      return {
        ...d,
        rate,
        stage: calculateStage(rate),
        examRate,
        examStage: calculateStage(examRate)
      };
    }));
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      setActiveTab((['farm', 'team', 'area', 'exam-farm', 'exam-team', 'exam-area'].includes(hash) ? hash : 'farm') as TabType);
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
  }, []);

  const stats = useMemo(() => {
    const isExam = mode === 'exam';
    const totalAchieved = data.reduce((sum, d) => sum + (isExam ? (d.examAchievement || 0) : d.achievement), 0);
    const totalTarget = data.reduce((sum, d) => sum + (isExam ? (d.examTarget || 0) : d.target), 0);
    const avgRate = totalTarget > 0 ? (totalAchieved / totalTarget) * 100 : 0;
    const fullBloomCount = data.filter(d => (isExam ? (d.examRate || 0) : d.rate) >= 100).length;
    
    // Remaining days until June 30th (from current time provided)
    const now = new Date();
    const end = new Date('2026-06-30T23:59:59');
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    return { avgRate, fullBloomCount, daysLeft: diff };
  }, [data, mode]);


  const renderContent = () => {
    if (activeTab.includes('farm')) {
      return <SunflowerField schools={data} mode={mode} />;
    } else if (activeTab.includes('team')) {
      return <TeamRanking schools={data} mode={mode} />;
    } else {
      return <AreaRanking schools={data} mode={mode} />;
    }
  };

  return (
    <div className="app-main">
      <header className="app-header">
        <div className="logo">
          <img src={`${import.meta.env.BASE_URL}assets/TOMONI.png`} alt="TOMONI Logo" className="header-logo" />
          <h1>TOMONIひまわり畑2026</h1>
          <Sun className="icon-sun" size={32} />
        </div>
        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-label">{mode === 'exam' ? 'TOMONI受験生達成率' : 'TOMONI全体達成率'}</span>
            <span className="stat-value">{stats.avgRate.toFixed(1)}%</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">満開の教室</span>
            <span className="stat-value">{stats.fullBloomCount} 教室</span>
          </div>
        </div>
        <div className="tab-controls">
          <a href="#farm" className={`tab-btn ${activeTab === 'farm' ? 'active' : ''}`}>全体<br/>教室一覧</a>
          <a href="#team" className={`tab-btn ${activeTab === 'team' ? 'active' : ''}`}>全体<br/>チーム</a>
          <a href="#area" className={`tab-btn ${activeTab === 'area' ? 'active' : ''}`}>全体<br/>エリア</a>
          <a href="#exam-farm" className={`tab-btn ${activeTab === 'exam-farm' ? 'active' : ''}`}>受験生<br/>教室一覧</a>
          <a href="#exam-team" className={`tab-btn ${activeTab === 'exam-team' ? 'active' : ''}`}>受験生<br/>チーム</a>
          <a href="#exam-area" className={`tab-btn ${activeTab === 'exam-area' ? 'active' : ''}`}>受験生<br/>エリア</a>
        </div>
      </header>

      <main className="content-area">
        {renderContent()}
        <aside className={`side-panel ${showRanking ? 'open' : ''}`}>
          <button className="toggle-ranking" onClick={() => setShowRanking(!showRanking)}>
            {showRanking ? '◀ フィールド表示' : '▶ ランキング表示'}
          </button>
          <RankingPanel schools={data} mode={mode} />
        </aside>
      </main>

      <div className="background-decoration">
        <Cloud className="cloud c1" size={100} />
        <Cloud className="cloud c2" size={150} />
      </div>
    </div>
  );
}

export default App;
