/**
 * スプライトシートから個別の成長ステージ画像を切り出すユーティリティ
 */

export const processSpriteSheets = async (sheetUrls: string[]): Promise<string[]> => {
  const allStages: string[] = [];

  for (let i = 0; i < sheetUrls.length; i++) {
    const url = sheetUrls[i];
    try {
      // 1-5, 6-10, 11-15, 16-20 の順で処理されるため、グループ番号を渡す
      const stages = await splitSheet(url, i + 1);
      allStages.push(...stages);
    } catch (error) {
      console.error(`Failed to process sheet: ${url}`, error);
      allStages.push(...Array(5).fill(''));
    }
  }

  return allStages;
};

const splitSheet = (url: string, groupNumber: number): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject('Failed to get canvas context');

      const frameWidth = img.width / 5;
      const frameHeight = img.height;
      
      const results: string[] = [];

      for (let i = 0; i < 5; i++) {
        // 全体を細長く出すのではなく、重要な部分を正方形でクロップする
        canvas.width = frameWidth;
        canvas.height = frameWidth; // 正方形にする
        
        // 垂直方向のクロップ開始位置を計算
        let sy = 0;
        if (groupNumber === 1) {
          // 初期段階（芽）は下の方にあるので、下部をクロップ
          sy = frameHeight - frameWidth;
        } else if (groupNumber === 2) {
          // 成長期は中央よりやや下
          sy = frameHeight * 0.4;
        } else {
          // 開花期は花（上部）をクロップ
          sy = 0;
        }

        ctx.clearRect(0, 0, frameWidth, frameWidth);
        ctx.drawImage(
          img,
          i * frameWidth, sy, frameWidth, frameWidth, // ソース領域（正方形）
          0, 0, frameWidth, frameWidth // 描画領域（正方形）
        );
        
        results.push(canvas.toDataURL('image/png'));
      }
      
      resolve(results);
    };
    img.onerror = reject;
    img.src = url;
  });
};
