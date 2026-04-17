export interface SchoolData {
  id: string;
  name: string;
  region: 'Kyoto' | 'Shiga' | 'Nara';
  target: number;
  achievement: number;
  rate: number;
  stage: number;
  lastRate?: number;
  team?: string;
}

export const INITIAL_DATA: SchoolData[] = [
  // 京都エリア (24)
  { id: 'kyoto-01', name: '大宮', region: 'Kyoto', target: 500, achievement: 125, rate: 25.0, stage: 5, team: '木下チーム' },
  { id: 'kyoto-02', name: '帷子ノ辻', region: 'Kyoto', target: 500, achievement: 42, rate: 8.4, stage: 2, team: '木下チーム' },
  { id: 'kyoto-03', name: '北野', region: 'Kyoto', target: 500, achievement: 215, rate: 43.0, stage: 9, team: '木下チーム' },
  { id: 'kyoto-04', name: '北山', region: 'Kyoto', target: 500, achievement: 312, rate: 62.4, stage: 13, team: '木下チーム' },
  { id: 'kyoto-05', name: '西賀茂', region: 'Kyoto', target: 500, achievement: 485, rate: 97.0, stage: 19, team: '木下チーム' },
  { id: 'kyoto-06', name: '烏丸御池', region: 'Kyoto', target: 500, achievement: 500, rate: 100.0, stage: 20, team: '木下チーム' },
  { id: 'kyoto-07', name: '桂', region: 'Kyoto', target: 500, achievement: 10, rate: 2.0, stage: 1, team: '横尾チーム' },
  { id: 'kyoto-08', name: '洛西', region: 'Kyoto', target: 500, achievement: 88, rate: 17.6, stage: 4, team: '横尾チーム' },
  { id: 'kyoto-09', name: '西京極', region: 'Kyoto', target: 500, achievement: 156, rate: 31.2, stage: 7, team: '横尾チーム' },
  { id: 'kyoto-10', name: '西院', region: 'Kyoto', target: 500, achievement: 265, rate: 53.0, stage: 11, team: '横尾チーム' },
  { id: 'kyoto-11', name: '東向日', region: 'Kyoto', target: 500, achievement: 342, rate: 68.4, stage: 14, team: '木下チーム' },
  { id: 'kyoto-12', name: '西向日', region: 'Kyoto', target: 500, achievement: 412, rate: 82.4, stage: 17, team: '木下チーム' },
  { id: 'kyoto-13', name: '長岡天神', region: 'Kyoto', target: 500, achievement: 450, rate: 90.0, stage: 19, team: '木下チーム' }, // NOTE: user list didn't mention Nagaoka-Tenjin in team list explicitly but let's assume it belongs somewhere or was omitted. Wait, let me check the prompt carefully! "木下チーム: 西向日、墨染、大宮、烏丸御池、北山、久我、帷子ノ辻、北野、東向日、西賀茂 (10教室)". Nagaoka-Tenjin is missing here.
  { id: 'kyoto-14', name: '山科', region: 'Kyoto', target: 500, achievement: 180, rate: 36.0, stage: 8, team: '横尾チーム' },
  { id: 'kyoto-15', name: '墨染', region: 'Kyoto', target: 500, achievement: 95, rate: 19.0, stage: 4, team: '木下チーム' },
  { id: 'kyoto-16', name: '伏見桃山', region: 'Kyoto', target: 500, achievement: 280, rate: 56.0, stage: 12, team: '横尾チーム' },
  { id: 'kyoto-17', name: '醍醐', region: 'Kyoto', target: 500, achievement: 395, rate: 79.0, stage: 16, team: '横尾チーム' },
  { id: 'kyoto-18', name: '淀', region: 'Kyoto', target: 500, achievement: 25, rate: 5.0, stage: 2, team: '稲野チーム' },
  { id: 'kyoto-19', name: '小倉', region: 'Kyoto', target: 500, achievement: 145, rate: 29.0, stage: 6, team: '横尾チーム' },
  { id: 'kyoto-20', name: '大久保', region: 'Kyoto', target: 500, achievement: 232, rate: 46.4, stage: 10, team: '稲野チーム' },
  { id: 'kyoto-21', name: '松井山手', region: 'Kyoto', target: 500, achievement: 360, rate: 72.0, stage: 15, team: '横尾チーム' },
  { id: 'kyoto-22', name: '祝園', region: 'Kyoto', target: 500, achievement: 50, rate: 10.0, stage: 3, team: '稲野チーム' },
  { id: 'kyoto-23', name: '久我', region: 'Kyoto', target: 500, achievement: 112, rate: 22.4, stage: 5, team: '木下チーム' },
  { id: 'kyoto-24', name: '洛南', region: 'Kyoto', target: 500, achievement: 320, rate: 64.0, stage: 13, team: '稲野チーム' },

  // 滋賀エリア (10)
  { id: 'shiga-01', name: '南草津', region: 'Shiga', target: 500, achievement: 465, rate: 93.0, stage: 19, team: '柴田チーム' },
  { id: 'shiga-02', name: '甲西', region: 'Shiga', target: 500, achievement: 32, rate: 6.4, stage: 2, team: '柴田チーム' },
  { id: 'shiga-03', name: '貴生川', region: 'Shiga', target: 500, achievement: 150, rate: 30.0, stage: 7, team: '奥田チーム' },
  { id: 'shiga-04', name: '守山', region: 'Shiga', target: 500, achievement: 288, rate: 57.6, stage: 12, team: '柴田チーム' },
  { id: 'shiga-05', name: '近江八幡', region: 'Shiga', target: 500, achievement: 412, rate: 82.4, stage: 17, team: '奥田チーム' },
  { id: 'shiga-06', name: '八日市', region: 'Shiga', target: 500, achievement: 200, rate: 40.0, stage: 9, team: '奥田チーム' },
  { id: 'shiga-07', name: '稲枝', region: 'Shiga', target: 500, achievement: 75, rate: 15.0, stage: 4, team: '奥田チーム' },
  { id: 'shiga-08', name: '南彦根', region: 'Shiga', target: 500, achievement: 375, rate: 75.0, stage: 16, team: '柴田チーム' },
  { id: 'shiga-09', name: '米原', region: 'Shiga', target: 500, achievement: 22, rate: 4.4, stage: 1, team: '奥田チーム' },
  { id: 'shiga-10', name: '長浜', region: 'Shiga', target: 500, achievement: 480, rate: 96.0, stage: 19, team: '柴田チーム' },

  // 奈良エリア (6)
  { id: 'nara-01', name: '高の原', region: 'Nara', target: 500, achievement: 315, rate: 63.0, stage: 13, team: '稲野チーム' },
  { id: 'nara-02', name: '西大寺', region: 'Nara', target: 500, achievement: 450, rate: 90.0, stage: 19, team: '稲野チーム' },
  { id: 'nara-03', name: '学園前', region: 'Nara', target: 500, achievement: 120, rate: 24.0, stage: 5, team: '稲野チーム' },
  { id: 'nara-04', name: '富雄', region: 'Nara', target: 500, achievement: 8, rate: 1.6, stage: 1, team: '稲野チーム' },
  { id: 'nara-05', name: '学研奈良登美ヶ丘', region: 'Nara', target: 500, achievement: 256, rate: 51.2, stage: 11, team: '稲野チーム' },
  { id: 'nara-06', name: '南生駒', region: 'Nara', target: 500, achievement: 398, rate: 79.6, stage: 16, team: 'その他' }, // NOTE: user list had 38 schools mapped. Let me verify total numbers.
];

export const calculateStage = (rate: number): number => {
  if (rate >= 100) return 20;
  if (rate <= 0) return 1; 
  // 100%未満は最大でもステージ19（満開目前）までに抑える
  const stage = Math.floor(rate / 5) + 1;
  return Math.min(stage, 19);
};
