import React, { useState } from 'react';
import type { SchoolData } from '../data';
import { X, Upload, Save, Lock, AlertCircle, Settings } from 'lucide-react';
import * as XLSX from 'xlsx';

interface Props {
  data: SchoolData[];
  onUpdate: (newData: SchoolData[]) => void;
  onClose: () => void;
}

const AdminMenu: React.FC<Props> = ({ data, onUpdate, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [editingData, setEditingData] = useState<SchoolData[]>([...data]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'tomoni117') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('パスワードが違います');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const jsonData = XLSX.utils.sheet_to_json(ws) as any[];

      const updated = editingData.map(school => {
        const row = jsonData.find(r => r['教室名'] === school.name || r['name'] === school.name);
        if (row) {
          return {
            ...school,
            target: Number(row['目標値'] || row['target'] || school.target),
            achievement: Number(row['実績値'] || row['achievement'] || school.achievement)
          };
        }
        return school;
      });

      setEditingData(updated);
    };
    reader.readAsBinaryString(file);
  };

  const handleManualChange = (id: string, field: 'target' | 'achievement', value: string) => {
    const numValue = parseInt(value) || 0;
    setEditingData(prev => prev.map(s => s.id === id ? { ...s, [field]: numValue } : s));
  };

  const handleSave = () => {
    onUpdate(editingData);
    onClose();
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
              <div className="file-upload">
                <label htmlFor="excel-upload" className="upload-label">
                  <Upload size={20} />
                  <span>Excel or CSVから一括インポート (.xlsx, .csv)</span>
                </label>
                <input id="excel-upload" type="file" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} style={{ display: 'none' }} />
              </div>
              <button className="reset-btn" onClick={() => {
                if (window.confirm('現在のデータをリセットして、デモ用（成長中）のデータを読み込みますか？')) {
                  // data.ts の INITIAL_DATA を基準に更新
                  import('../data').then(m => setEditingData([...m.INITIAL_DATA]));
                }
              }}>
                デモデータを読み込む
              </button>
            </div>
            <p className="hint-text"><AlertCircle size={14} /> 「教室名」「目標値」「実績値」の列を含むファイルを指定してください。</p>
          </div>

          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>エリア</th>
                  <th>教室名</th>
                  <th>目標コマ数</th>
                  <th>実績コマ数</th>
                  <th>達成率</th>
                </tr>
              </thead>
              <tbody>
                {editingData.map(school => (
                  <tr key={school.id}>
                    <td className="area-cell">{school.region}</td>
                    <td className="name-cell">{school.name}</td>
                    <td>
                      <input 
                        type="number" 
                        value={school.target} 
                        onChange={(e) => handleManualChange(school.id, 'target', e.target.value)} 
                      />
                    </td>
                    <td>
                      <input 
                        type="number" 
                        value={school.achievement} 
                        onChange={(e) => handleManualChange(school.id, 'achievement', e.target.value)} 
                      />
                    </td>
                      {((school.achievement / school.target) * 100).toFixed(1)}%
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <footer className="modal-footer">
          <button className="cancel-pill" onClick={onClose}>キャンセル</button>
          <button className="save-pill" onClick={handleSave}>
            <Save size={18} />
            変更を適用する
          </button>
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
        .admin-buttons-row { display: flex; gap: 15px; align-items: center; flex-wrap: wrap; }
        .upload-label {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: #e3f2fd;
          color: #1976d2;
          padding: 12px 24px;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 700;
          transition: all 0.2s;
        }
        .upload-label:hover { background: #bbdefb; }
        .reset-btn {
          background: #fff3e0;
          color: #ef6c00;
          border: 2px solid #ffe0b2;
          padding: 10px 20px;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        .reset-btn:hover { background: #ffe0b2; }
        .hint-text { font-size: 0.8rem; color: #888; margin-top: 10px; display: flex; align-items: center; gap: 5px; }
        
        .data-table-wrapper { flex: 1; overflow-y: auto; border: 1px solid #eee; border-radius: 12px; }
        .data-table { width: 100%; border-collapse: collapse; }
        .data-table th { position: sticky; top: 0; background: #fafafa; border-bottom: 2px solid #eee; padding: 12px; text-align: left; font-size: 0.9rem; color: #666; }
        .data-table td { padding: 8px 12px; border-bottom: 1px solid #f5f5f5; }
        .data-table input { width: 80px; padding: 6px; border: 1px solid #ddd; border-radius: 6px; text-align: right; }
        
        .area-cell { font-size: 0.8rem; color: #888; }
        .name-cell { font-weight: 700; color: #5d4037; }
        .rate-cell { font-weight: 800; color: #388e3c; }

        .modal-footer { padding: 20px 30px; border-top: 2px solid #f0f0f0; display: flex; justify-content: flex-end; gap: 15px; background: #fafafa; }
        .save-pill { background: #388e3c; color: white; border: none; padding: 10px 25px; border-radius: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px; }
        .save-pill:hover { background: #2e7d32; }

        .icon-spin:hover { animation: spin 2s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default AdminMenu;
