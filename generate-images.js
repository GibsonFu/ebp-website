/**
 * 東竹藥品網站 — AI 圖片生成腳本
 * 使用 Pollinations.ai（完全免費，無需 API Key）
 */

const https = require('https');
const fs    = require('fs');
const path  = require('path');

const imgDir = path.join(__dirname, 'images');
if (!fs.existsSync(imgDir)) fs.mkdirSync(imgDir);

const images = [
  {
    file:   'hero-bg.jpg',
    prompt: 'modern pharmaceutical company office Taiwan, bright clean white interior, large windows, medical professionals walking, warm natural light, wide angle architectural photography, ultra realistic',
    w: 1600, h: 900,
  },
  {
    file:   'about-team.jpg',
    prompt: 'professional pharmaceutical sales team meeting in modern conference room, Taiwan business people, charts on screen, bright office, candid corporate photography, ultra realistic',
    w: 900, h: 700,
  },
  {
    file:   'about-lab.jpg',
    prompt: 'pharmaceutical research laboratory, scientist examining medicine samples, clean white lab environment, modern equipment, Taiwan medical research, ultra realistic',
    w: 900, h: 700,
  },
  {
    file:   'product-branded.jpg',
    prompt: 'premium branded prescription medicine bottles and blister packs on clean white surface, professional pharmaceutical product photography, elegant lighting, ultra realistic',
    w: 900, h: 600,
  },
  {
    file:   'product-generic.jpg',
    prompt: 'generic pharmaceutical tablets and capsules, organized medicine display, clean white background, professional medical product photography, soft shadows, ultra realistic',
    w: 900, h: 600,
  },
  {
    file:   'hero-badge.jpg',
    prompt: 'Taiwan city skyline at dusk with modern hospital building, soft blue tones, professional photography, cinematic',
    w: 1200, h: 800,
  },
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, res => {
      // Follow redirect (Pollinations returns 307)
      if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307 || res.statusCode === 308) {
        file.destroy();
        fs.unlinkSync(dest);
        download(res.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', err => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function generate() {
  for (const img of images) {
    const encoded = encodeURIComponent(img.prompt);
    const url = `https://image.pollinations.ai/prompt/${encoded}?width=${img.w}&height=${img.h}&nologo=true&model=flux-realism&seed=${Math.floor(Math.random()*99999)}`;
    const dest = path.join(imgDir, img.file);

    process.stdout.write(`⏳ 生成中: ${img.file} ...`);
    try {
      await download(url, dest);
      const kb = Math.round(fs.statSync(dest).size / 1024);
      console.log(` ✅ 完成 (${kb} KB)`);
    } catch (e) {
      console.log(` ❌ 失敗: ${e.message}`);
    }

    // 每張間隔 1.5 秒，避免請求太快
    await new Promise(r => setTimeout(r, 1500));
  }
  console.log('\n🎉 全部完成！圖片已存至 images/ 資料夾');
}

generate();
