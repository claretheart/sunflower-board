import * as XLSX from 'xlsx';
import type { SchoolData } from '../data';

// Google スプレッドシート（Webに公開 - CSV形式）のURL
// ※ここにユーザーが発行したURLを入れることで、全ユーザーのPCで同期されます。
export const GOOGLE_SHEETS_CSV_URL = "";

export const fetchAndUpdateData = async (currentData: SchoolData[], url: string): Promise<SchoolData[]> => {
  if (!url) return currentData;
  
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('データ取得に失敗しました');
    const csvText = await response.text();
    
    // xlsxや手動でCSVをパースする
    const wb = XLSX.read(csvText, { type: 'string' });
    const wsname = wb.SheetNames[0];
    const ws = wb.Sheets[wsname];
    const jsonData = XLSX.utils.sheet_to_json(ws) as Record<string, string | number>[];

    // jsonからデータを更新
    const updated = currentData.map(school => {
      // "教室名" または "name" でマッチング（スプレッドシートの入力規則用）
      const row = jsonData.find(r => r['教室名'] === school.name || r['name'] === school.name);
      if (row) {
        return {
          ...school,
          target: Number(row['目標値'] || row['目標'] || row['target'] || school.target),
          achievement: Number(row['実績値'] || row['実績'] || row['achievement'] || school.achievement)
        };
      }
      return school;
    });

    return updated;
  } catch (err) {
    console.error("Fetch Error:", err);
    return currentData; // 失敗時は元のデータをそのまま返す
  }
};
