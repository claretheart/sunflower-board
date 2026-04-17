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
  type TabType = 'farm' | 'team' | 'exam-farm' | 'exam-team';
  const [activeTab, setActiveTab] = useState<TabType>(() => {
    const hash = window.location.hash.replace('#', '');
    if (['farm', 'team', 'exam-farm', 'exam-team'].includes(hash)) {
      return hash as TabType;
    }
    return 'farm';
  });
  
  const mode: 'overall' | 'exam' = activeTab.includes('exam') ? 'exam' : 'overall';

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      setActiveTab((['farm', 'team', 'exam-farm', 'exam-team'].includes(hash) ? hash : 'farm') as TabType);
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

  return (
    <div className="app-main">
      <header className="app-header">
        <div className="logo">
          <Sun className="icon-sun" size={32} />
          <h1>TOMONIひまわり畑2026</h1>
        </div>
        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-label">{mode === 'exam' ? '受験生平均達成率' : '全体平均達成率'}</span>
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
          <a href="#exam-farm" className={`tab-btn ${activeTab === 'exam-farm' ? 'active' : ''}`}>受験生<br/>教室一覧</a>
          <a href="#exam-team" className={`tab-btn ${activeTab === 'exam-team' ? 'active' : ''}`}>受験生<br/>チーム</a>
        </div>
        <button className="admin-btn" onClick={() => setIsAdminOpen(true)}>
          <Settings size={20} />
          <span>管理</span>
        </button>
      </header>

      <main className="content-area">
        {activeTab.includes('farm') ? (
          <SunflowerField schools={data} mode={mode} />
        ) : (
          <TeamRanking schools={data} mode={mode} />
        )}
        <aside className={`side-panel ${showRanking ? 'open' : ''}`}>
          <button className="toggle-ranking" onClick={() => setShowRanking(!showRanking)}>
            {showRanking ? '◀ フィールド表示' : '▶ ランキング表示'}
          </button>
          <RankingPanel schools={data} mode={mode} />
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
