import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_URL = 'http://localhost:3000';
const VIDEO_DIR = path.resolve(__dirname, '..', 'videos');

let browser;
let context;
let page;

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function clickAndPause(selector, pause = 1500) {
  const el = page.locator(selector);
  if (await el.isVisible()) {
    await el.hover();
    await sleep(400);
    await el.click();
    await sleep(pause);
  }
}

async function main() {
  browser = await chromium.launch({ headless: false });
  context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    recordVideo: { dir: VIDEO_DIR, size: { width: 1280, height: 800 } },
  });

  page = await context.newPage();

  /* ───── 1. INTRO ───── */

  console.log('Cargando catálogo...');
  await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 15000 });

  const hayProductos = await page.locator('.producto').first()
    .waitFor({ timeout: 8000 }).then(() => true).catch(() => false);

  if (hayProductos) console.log('Productos cargados.');
  await sleep(2000);

  /* ───── 2. FILTRADO POR CATEGORÍAS ───── */

  const categorias = [
    { id: 'escritorios' },
    { id: 'mesitas' },
    { id: 'bibliotecas' },
    { id: 'sillas' },
    { id: 'todos' },
  ];

  for (const cat of categorias) {
    console.log(`Filtrando: ${cat.id}`);
    await clickAndPause(`#${cat.id}.boton-categoria`, 1600);
  }

  /* ───── 3. HOVERS ───── */

  if (hayProductos) {
    console.log('Hover en producto...');
    const prod = page.locator('.producto').first();
    await prod.hover();
    await sleep(1800);

    console.log('Hover en Solicitar Información...');
    const infoBtn = page.locator('.producto-informacion').first();
    await infoBtn.hover();
    await sleep(1200);

    /* ───── 4. FAVORITOS ───── */

    const botones = page.locator('.producto-agregar');
    const cantidad = Math.min(3, await botones.count());

    for (let i = 0; i < cantidad; i++) {
      console.log(`Agregando producto ${i + 1} a Favoritos...`);
      const btn = botones.nth(i);
      await btn.hover();
      await sleep(300);
      await btn.click();
      await sleep(1000);
    }

    await sleep(600);

    const linkFav = page.locator('a.boton-favoritos');
    if (await linkFav.isVisible()) {
      console.log('Yendo a Favoritos...');
      await linkFav.hover();
      await sleep(400);
      await Promise.all([
        page.waitForURL(/\/favoritos/, { timeout: 8000 }),
        linkFav.click(),
      ]);
      await sleep(2500);
    }

    /* Volver al catálogo */
    const btnVolver = page.locator('.boton-volver');
    if (await btnVolver.isVisible()) {
      console.log('Volviendo al catálogo...');
      await btnVolver.hover();
      await sleep(300);
      await Promise.all([
        page.waitForURL(url => !url.pathname.includes('favoritos'), { timeout: 8000 }),
        btnVolver.click(),
      ]);
      await sleep(1200);
    }
  }

  /* ───── 5. MOBILE (sin cambiar viewport) ───── */

  console.log('Vista mobile...');

  await page.evaluate(() => {
    const style = document.createElement('style');
    style.id = '__demo_mobile';
    style.textContent = `
      .wrapper { grid-template-columns: 1fr !important; }
      aside {
        position: fixed !important;
        z-index: 9 !important;
        left: 0 !important;
        top: 0 !important;
        transform: translateX(-100%) !important;
        opacity: 0 !important;
        visibility: hidden !important;
        transition: 0.3s !important;
      }
      aside.aside-visible {
        transform: translateX(0) !important;
        opacity: 1 !important;
        visibility: visible !important;
      }
      .header-mobile { display: flex !important; }
      main { margin: 1rem !important; padding: 1.25rem !important; border-radius: 12px !important; }
      .contenedor-productos { grid-template-columns: 1fr !important; gap: 1rem !important; }
      .producto-imagen { height: 200px !important; }
      .close-menu { display: block !important; }
    `;
    document.head.appendChild(style);
  });
  await sleep(800);

  /* Abrir menú */
  const openBtn = page.locator('#open-menu');
  if (await openBtn.isVisible()) {
    console.log('Abriendo menú hamburguesa...');
    await openBtn.hover();
    await sleep(300);
    await openBtn.click();
    await sleep(2000);
  }

  /* Cerrar menú */
  const closeBtn = page.locator('#close-menu');
  if (await closeBtn.isVisible()) {
    console.log('Cerrando menú...');
    await closeBtn.hover();
    await sleep(300);
    await closeBtn.click();
    await sleep(1200);
  }

  /* Restaurar vista desktop */
  await page.evaluate(() => {
    const style = document.getElementById('__demo_mobile');
    if (style) style.remove();
  });
  await sleep(1000);

  console.log('Grabación finalizada.');
}

main()
  .catch(err => {
    console.error('Error:', err.message);
  })
  .finally(async () => {
    if (context) await context.close();
    if (browser) await browser.close();

    /* Esperar a que el video termine de escribirse */
    await sleep(500);

    /* Buscar el .webm más reciente */
    const files = fs.readdirSync(VIDEO_DIR)
      .filter(f => f.endsWith('.webm'))
      .map(f => ({ name: f, time: fs.statSync(path.join(VIDEO_DIR, f)).mtimeMs }))
      .sort((a, b) => b.time - a.time);

    if (files.length === 0) {
      console.log('No se encontró video.');
      return;
    }

    const webm = path.join(VIDEO_DIR, files[0].name);
    const mp4 = webm.replace('.webm', '.mp4');

    try {
      console.log('Convirtiendo a MP4...');
      execSync(`ffmpeg -y -i "${webm}" -c:v libx264 -preset fast -crf 22 -pix_fmt yuv420p "${mp4}"`, {
        stdio: 'ignore',
        timeout: 30000,
      });
      fs.unlinkSync(webm);
      console.log('Video listo:', mp4);
    } catch {
      console.log('No se pudo convertir (falta ffmpeg?), el .webm igual está en:', webm);
    }
  });
