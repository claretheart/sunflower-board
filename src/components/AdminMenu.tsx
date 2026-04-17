import React, { useState } from 'react';
import type { SchoolData } from '../data';
import { X, Lock, AlertCircle, Settings } from 'lucide-react';

interface Props {
  data: SchoolData[];
  onClose: () => void;
}

const AdminMenu: React.FC<Props> = ({ data, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'tomoni117') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('パスワードが違います');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-overlay">
        <div className="login-card">
          <Lock size={48} color="#795548" />
          <h2>管理者認証</h2>
          <form onSubmit={handleLogin}>
            <input 
              type="password" 
              placeholder="パスワードを入力" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            {error && <p className="error-msg">{error}</p>}
            <div className="login-btns">
              <button type="button" onClick={onClose} className="cancel-pill">閉じる</button>
              <button type="submit" className="login-pill">ログイン</button>
            </div>
          </form>
        </div>
        <style>{`
          .admin-overlay {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.6);
            backdrop-filter: blur(5px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 200;
          }
          .login-card {
            background: white;
            padding: 40px;
            border-radius: 20px;
            width: 350px;
            display: flex;
            flex-direction: column;
            align-items: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          }
          .login-card input {
            width: 100%;
            padding: 12px;
            margin: 20px 0 10px;
            border: 2px solid #ddd;
            border-radius: 10px;
            text-align: center;
            font-size: 1.1rem;
          }
          .error-msg { color: #f44336; font-size: 0.85rem; margin-bottom: 10px; }
          .login-btns { display: flex; gap: 10px; width: 100%; }
          .login-pill, .cancel-pill { flex: 1; padding: 10px; border-radius: 10px; border: none; font-weight: 700; cursor: pointer; }
          .login-pill { background: #795548; color: white; }
          .cancel-pill { background: #eee; color: #666; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="admin-overlay">
      <div className="admin-modal">
        <header className="modal-header">
          <div className="modal-title">
            <Settings className="icon-spin" />
            <h2>データ管理</h2>
          </div>
          <button className="close-btn" onClick={onClose}><X /></button>
        </header>

        <div className="modal-content">
          <div className="admin-actions">
            <div className="admin-buttons-row">
              <div className="alert-info">
                <strong><AlertCircle size={18} /> データは自動同期されています</strong>
                <p>Googleスプレッドシートとの連携が有効です。<br/>数値の更新は指定のスプレッドシート上で行ってください。変更はリロードで自動反映されます。</p>
              </div>
            </div>
          </div>

          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>エリア</th>
                  <th>チーム</th>
                  <th>教室名</th>
                  <th>目標コマ数</th>
                  <th>実績コマ数</th>
                  <th>達成率</th>
                </tr>
              </thead>
              <tbody>
                {data.map(school => (
                  <tr key={school.id}>
                    <td className="area-cell">{school.region}</td>
                    <td className="team-cell">{school.team || '未設定'}</td>
                    <td className="name-cell">{school.name}</td>
                    <td>{school.target}</td>
                    <td>{school.achievement}</td>
                    <td className="rate-cell">{school.rate.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <footer className="modal-footer">
          <button className="cancel-pill" onClick={onClose}>閉じる</button>
        </footer>
      </div>

      <style>{`
        .admin-modal {
          background: white;
          width: 90%;
          max-width: 900px;
          height: 80vh;
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 15px 50px rgba(0,0,0,0.3);
        }
        .modal-header {
          padding: 20px 30px;
          border-bottom: 2px solid #f0f0f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #f9f9f9;
        }
        .modal-title { display: flex; align-items: center; gap: 12px; }
        .modal-title h2 { margin: 0; font-size: 1.5rem; color: #5d4037; }
        .close-btn { background: none; border: none; cursor: pointer; color: #999; }
        
        .modal-content { flex: 1; overflow: hidden; display: flex; flex-direction: column; padding: 30px; }
        .admin-actions { margin-bottom: 25px; }
        .alert-info {
           background: #e3f2fd;
           padding: 15px 20px;
           border-radius: 12px;
           color: #1976d2;
        }
        .alert-info strong { display: flex; align-items: center; gap: 8px; margin-bottom: 5px; font-size: 1.1rem; }
        .alert-info p { margin: 0; font-size: 0.95rem; line-height: 1.4; color: #0d47a1; }
        
        .data-table-wrapper { flex: 1; overflow-y: auto; border: 1px solid #eee; border-radius: 12px; }
        .data-table { width: 100%; border-collapse: collapse; }
        .data-table th { position: sticky; top: 0; background: #fafafa; border-bottom: 2px solid #eee; padding: 12px; text-align: left; font-size: 0.9rem; color: #666; }
        .data-table td { padding: 8px 12px; border-bottom: 1px solid #f5f5f5; }
        
        .area-cell { font-size: 0.8rem; color: #888; }
        .team-cell { font-size: 0.8rem; color: #444; background: #fafafa; border-radius: 4px; padding: 4px 8px; }
        .name-cell { font-weight: 700; color: #5d4037; }
        .rate-cell { font-weight: 800; color: #388e3c; }

        .modal-footer { padding: 20px 30px; border-top: 2px solid #f0f0f0; display: flex; justify-content: flex-end; gap: 15px; background: #fafafa; }
        .cancel-pill { background: #eee; color: #666; border: none; padding: 10px 25px; border-radius: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px; }
        .cancel-pill:hover { background: #ddd; }

        .icon-spin:hover { animation: spin 2s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default AdminMenu;
