const express = require('express');
const path = require('path');
const Database = require('better-sqlite3');
const ExcelJS = require('exceljs');
const CATEGORIES = require('./products');

const app = express();
const PORT = process.env.PORT || 3000;
const PASSWORD = 'govardhan123';

// ─── Middleware ───────────────────────────────────────────────
app.use(express.json({ limit: '5mb' }));
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  next();
});
app.use(express.static(path.join(__dirname, 'public')));

// ─── Database Setup ──────────────────────────────────────────
const dataDir = path.join(__dirname, '.data');
const fs = require('fs');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}
const db = new Database(path.join(dataDir, 'claims.db'));
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    shop_name TEXT NOT NULL,
    town TEXT NOT NULL,
    claim_date TEXT NOT NULL,
    claim_type TEXT NOT NULL,
    items TEXT NOT NULL,
    submitted_at TEXT DEFAULT (datetime('now', 'localtime'))
  )
`);

// ─── Auth helper ─────────────────────────────────────────────
function checkPassword(req, res) {
  const pw = req.headers['x-password'] || req.query.password;
  if (pw !== PASSWORD) {
    res.status(401).json({ error: 'Invalid password' });
    return false;
  }
  return true;
}

// ─── API: Get products ───────────────────────────────────────
app.get('/api/products', (req, res) => {
  res.json(CATEGORIES);
});

// ─── API: Submit a claim ─────────────────────────────────────
app.post('/api/submit', (req, res) => {
  try {
    const { shop_name, town, claim_date, claim_type, items } = req.body;

    if (!shop_name || !town || !claim_date || !claim_type || !items || !items.length) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const stmt = db.prepare(`
      INSERT INTO submissions (shop_name, town, claim_date, claim_type, items)
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = stmt.run(shop_name, town, claim_date, claim_type, JSON.stringify(items));
    res.json({ success: true, id: result.lastInsertRowid });
  } catch (err) {
    console.error('Submit error:', err);
    res.status(500).json({ error: 'Failed to save submission' });
  }
});

// ─── API: Get all submissions ────────────────────────────────
app.get('/api/submissions', (req, res) => {
  if (!checkPassword(req, res)) return;

  try {
    const rows = db.prepare('SELECT * FROM submissions ORDER BY submitted_at DESC').all();
    const submissions = rows.map(r => ({
      ...r,
      items: JSON.parse(r.items)
    }));
    res.json(submissions);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

// ─── API: Export Excel ───────────────────────────────────────
app.get('/api/export', async (req, res) => {
  if (!checkPassword(req, res)) return;

  try {
    const slNo = req.query.sl_no || '1';
    const exportDate = req.query.date || new Date().toISOString().split('T')[0];

    // Fetch all submissions
    const rows = db.prepare('SELECT * FROM submissions ORDER BY submitted_at DESC').all();

    // Aggregate: product_code → { bl, exp, unsaleable, others }
    const agg = {};
    for (const row of rows) {
      const items = JSON.parse(row.items);
      const claimType = row.claim_type;
      for (const item of items) {
        if (!agg[item.code]) {
          agg[item.code] = { bl: 0, exp: 0, unsaleable: 0, others: 0 };
        }
        const col = claimType === 'Breakage' ? 'bl'
                   : claimType === 'Expiry' ? 'exp'
                   : claimType === 'Unsaleable' ? 'unsaleable'
                   : 'others';
        agg[item.code][col] += item.quantity;
      }
    }

    // ─── Build Excel Workbook ────────────────────────────────
    const workbook = new ExcelJS.Workbook();
    const ws = workbook.addWorksheet('Damage Claim', {
      pageSetup: { orientation: 'landscape', fitToPage: true }
    });

    // Column widths
    ws.columns = [
      { width: 5 },   // A: SL / row nums
      { width: 16 },  // B: Material Code
      { width: 38 },  // C: Material Name
      { width: 8 },   // D: B/L
      { width: 8 },   // E: EXP
      { width: 11 },  // F: Unsaleable
      { width: 8 },   // G: Others
      { width: 14 },  // H: Total (Qty In Pkts)
      { width: 16 }   // I: Checked by RGC
    ];

    const borderAll = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };

    const headerFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF2CC' } };
    const subtotalFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE8F5E9' } };
    const grandTotalFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFCDD2' } };
    const catHeaderFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFBBDEFB' } };

    let r = 1;

    // ── Title Row ────────────────────────────────────────────
    ws.mergeCells(r, 1, r, 9);
    const titleCell = ws.getCell(r, 1);
    titleCell.value = 'M.T.R FOODS PRIVATE LIMITED, BANGALORE';
    titleCell.font = { bold: true, size: 14, name: 'Arial' };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    ws.getRow(r).height = 28;
    r++;

    // ── Subtitle Row ─────────────────────────────────────────
    ws.mergeCells(r, 1, r, 9);
    const subCell = ws.getCell(r, 1);
    subCell.value = 'SECONDARY DAMAGE CLAIM';
    subCell.font = { bold: true, size: 12, name: 'Arial' };
    subCell.alignment = { horizontal: 'center', vertical: 'middle' };
    ws.getRow(r).height = 22;
    r++;

    // ── Blank row ────────────────────────────────────────────
    r++;

    // ── Stockist Info ────────────────────────────────────────
    ws.mergeCells(r, 1, r, 5);
    ws.getCell(r, 1).value = 'Stockist Name: Govardhan Agencies';
    ws.getCell(r, 1).font = { bold: true, size: 11, name: 'Arial' };
    ws.mergeCells(r, 6, r, 9);
    ws.getCell(r, 6).value = `SL No: ${slNo}`;
    ws.getCell(r, 6).font = { bold: true, size: 11, name: 'Arial' };
    ws.getCell(r, 6).alignment = { horizontal: 'right' };
    r++;

    ws.mergeCells(r, 1, r, 5);
    ws.getCell(r, 1).value = 'Town: Arsikere, Arsikere-573103';
    ws.getCell(r, 1).font = { bold: true, size: 11, name: 'Arial' };
    ws.mergeCells(r, 6, r, 9);
    ws.getCell(r, 6).value = `Date: ${exportDate}`;
    ws.getCell(r, 6).font = { bold: true, size: 11, name: 'Arial' };
    ws.getCell(r, 6).alignment = { horizontal: 'right' };
    r++;

    // ── Blank row ────────────────────────────────────────────
    r++;

    // ── Column Headers ───────────────────────────────────────
    const headers = ['#', 'Material Code', 'Material Name', 'B/L', 'EXP', 'Unsaleable', 'Others', 'Total (Qty In Pkts)', 'Checked by RGC'];
    const headerRow = ws.getRow(r);
    headers.forEach((h, i) => {
      const cell = headerRow.getCell(i + 1);
      cell.value = h;
      cell.font = { bold: true, size: 10, name: 'Arial' };
      cell.fill = headerFill;
      cell.border = borderAll;
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    });
    headerRow.height = 30;
    r++;

    // ── Product Rows by Category ─────────────────────────────
    let serialNo = 1;
    let grandBl = 0, grandExp = 0, grandUnsaleable = 0, grandOthers = 0, grandTotal = 0;

    for (const cat of CATEGORIES) {
      // Category header row
      ws.mergeCells(r, 1, r, 9);
      const catCell = ws.getCell(r, 1);
      catCell.value = cat.name;
      catCell.font = { bold: true, size: 10, name: 'Arial', italic: true };
      catCell.fill = catHeaderFill;
      catCell.border = borderAll;
      catCell.alignment = { horizontal: 'left', vertical: 'middle' };
      ws.getRow(r).height = 20;
      r++;

      let catBl = 0, catExp = 0, catUnsaleable = 0, catOthers = 0, catTotal = 0;

      for (const prod of cat.products) {
        const d = agg[prod.code] || { bl: 0, exp: 0, unsaleable: 0, others: 0 };
        const total = d.bl + d.exp + d.unsaleable + d.others;

        catBl += d.bl;
        catExp += d.exp;
        catUnsaleable += d.unsaleable;
        catOthers += d.others;
        catTotal += total;

        const row = ws.getRow(r);
        const vals = [serialNo, prod.code, prod.name, d.bl || '', d.exp || '', d.unsaleable || '', d.others || '', total || '', ''];
        vals.forEach((v, i) => {
          const cell = row.getCell(i + 1);
          cell.value = v;
          cell.font = { size: 9, name: 'Arial' };
          cell.border = borderAll;
          if (i >= 3 && i <= 7) cell.alignment = { horizontal: 'center' };
          if (i === 2) cell.alignment = { wrapText: true };

          // Highlight rows with claims
          if (total > 0) {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE8F5E9' } };
          }
        });
        row.height = 16;
        serialNo++;
        r++;
      }

      // ── Category Subtotal ──────────────────────────────────
      ws.mergeCells(r, 1, r, 3);
      const stCell = ws.getCell(r, 1);
      stCell.value = `${cat.name} Total Qty`;
      stCell.font = { bold: true, size: 10, name: 'Arial' };
      stCell.fill = subtotalFill;
      stCell.border = borderAll;
      stCell.alignment = { horizontal: 'right' };

      const stVals = [catBl || '', catExp || '', catUnsaleable || '', catOthers || '', catTotal || '', ''];
      stVals.forEach((v, i) => {
        const cell = ws.getCell(r, 4 + i);
        cell.value = v;
        cell.font = { bold: true, size: 10, name: 'Arial' };
        cell.fill = subtotalFill;
        cell.border = borderAll;
        cell.alignment = { horizontal: 'center' };
      });
      ws.getRow(r).height = 20;
      r++;

      grandBl += catBl;
      grandExp += catExp;
      grandUnsaleable += catUnsaleable;
      grandOthers += catOthers;
      grandTotal += catTotal;
    }

    // ── Grand Total Row ──────────────────────────────────────
    ws.mergeCells(r, 1, r, 3);
    const gtCell = ws.getCell(r, 1);
    gtCell.value = 'GRAND TOTAL';
    gtCell.font = { bold: true, size: 11, name: 'Arial' };
    gtCell.fill = grandTotalFill;
    gtCell.border = borderAll;
    gtCell.alignment = { horizontal: 'right', vertical: 'middle' };

    const gtVals = [grandBl || '', grandExp || '', grandUnsaleable || '', grandOthers || '', grandTotal || '', ''];
    gtVals.forEach((v, i) => {
      const cell = ws.getCell(r, 4 + i);
      cell.value = v;
      cell.font = { bold: true, size: 11, name: 'Arial' };
      cell.fill = grandTotalFill;
      cell.border = borderAll;
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });
    ws.getRow(r).height = 24;
    r += 2;

    // ── Footer Section ───────────────────────────────────────
    ws.mergeCells(r, 1, r, 3);
    ws.getCell(r, 1).value = 'Signature of TSE/BDE:';
    ws.getCell(r, 1).font = { bold: true, size: 10, name: 'Arial' };
    ws.mergeCells(r, 4, r, 6);
    ws.getCell(r, 4).value = 'Signature of ASM/RM:';
    ws.getCell(r, 4).font = { bold: true, size: 10, name: 'Arial' };
    ws.mergeCells(r, 7, r, 9);
    ws.getCell(r, 7).value = 'Total Bags:';
    ws.getCell(r, 7).font = { bold: true, size: 10, name: 'Arial' };
    r += 2;

    ws.mergeCells(r, 1, r, 5);
    ws.getCell(r, 1).value = 'Seal & Signature of Stockist:';
    ws.getCell(r, 1).font = { bold: true, size: 10, name: 'Arial' };
    r += 2;

    ws.mergeCells(r, 1, r, 9);
    ws.getCell(r, 1).value = 'Note: B/L - Breakage/Leakage, EXP - Expiry, Unsaleable';
    ws.getCell(r, 1).font = { italic: true, size: 9, name: 'Arial', color: { argb: 'FF666666' } };

    // ── Save to temp file & send ─────────────────────────────
    const fs = require('fs');
    const tmpDir = path.join(__dirname, 'tmp');
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);
    const fileName = `MTR_Damage_Claim_${exportDate}_SL${slNo}.xlsx`;
    const filePath = path.join(tmpDir, fileName);
    await workbook.xlsx.writeFile(filePath);
    res.download(filePath, fileName, (err) => {
      // Clean up temp file after download
      fs.unlink(filePath, () => {});
      if (err && !res.headersSent) {
        res.status(500).json({ error: 'Download failed' });
      }
    });

  } catch (err) {
    console.error('Export error:', err);
    res.status(500).json({ error: 'Failed to generate Excel' });
  }
});

// ─── Serve SPA & Temporarily serve deployment zip ─────────────
app.get('/deploy-zip', (req, res) => {
  res.download(path.join(__dirname, 'App.zip'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ─── Start Server ────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n  🍛  MTR Damage Claims App running at http://localhost:${PORT}\n`);
});
