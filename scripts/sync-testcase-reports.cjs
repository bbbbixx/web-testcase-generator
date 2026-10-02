const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const sourcePath = path.join(root, 'testcases', 'test', 'extracted_testcases.json');
const testcases = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
const testIdPattern = /\btest\s*\(\s*['"`]?(TC-STS-\d{2}-\d{2}-\d{2})/g;
const specsById = new Map();

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (entry.name.endsWith('.spec.ts')) {
      const source = fs.readFileSync(fullPath, 'utf8');
      for (const match of source.matchAll(testIdPattern)) {
        const id = match[1];
        if (!specsById.has(id)) specsById.set(id, new Set());
        specsById.get(id).add(path.relative(root, fullPath).replaceAll(path.sep, '/'));
      }
    }
  }
}

walk(path.join(root, 'testcases'));

const byFeature = new Map();
for (const testcase of testcases) {
  const featureId = testcase.feature.match(/FN-STS-\d{2}/)?.[0] ?? 'FN-STS-UNKNOWN';
  if (!byFeature.has(featureId)) byFeature.set(featureId, new Map());
  const cases = byFeature.get(featureId);
  if (!cases.has(testcase.tc_id)) cases.set(testcase.tc_id, testcase);
}

const allDocumentIds = new Set([...byFeature.values()].flatMap((cases) => [...cases.keys()]));
const codeOnlyIds = [...specsById.keys()].filter((id) => !allDocumentIds.has(id)).sort();
const totalDocumented = allDocumentIds.size;
const implementedDocumented = [...allDocumentIds].filter((id) => specsById.has(id)).length;
const featureIds = [...byFeature.keys()].sort();

function summary(featureId, cases) {
  const ids = [...cases.keys()];
  const implemented = ids.filter((id) => specsById.has(id));
  return { ids, implemented, missing: ids.filter((id) => !specsById.has(id)) };
}

const lines = [
  '# รายงานความสอดคล้องระหว่างเอกสาร Test Case กับ Playwright Spec',
  '',
  `แหล่งอ้างอิง: \`testcases/test/extracted_testcases.json\` (${totalDocumented} Test Case IDs ใน ${featureIds.length} ฟังก์ชัน)`,
  `พบ TC ID ในไฟล์ Playwright: ${implementedDocumented}/${totalDocumented} (${((implementedDocumented / totalDocumented) * 100).toFixed(1)}%)`,
  `ยังไม่พบใน Spec: ${totalDocumented - implementedDocumented} เคส`,
  `พบ TC ID ในโค้ดที่ไม่มีในเอกสารต้นทาง: ${codeOnlyIds.length} เคส`,
  '',
  '> สถานะ “พบใน Spec” หมายถึงพบรหัส TC ในไฟล์ทดสอบเท่านั้น ไม่ได้ยืนยันว่า assertion ตรงกับ Expected Result หรือเคสนั้นผ่านแล้ว รายงานนี้ไม่แทนผลการรันทดสอบ',
  '',
  '## สรุปตามฟังก์ชัน',
  '',
  '| ฟังก์ชัน | เคสในเอกสาร | พบใน Spec | ยังไม่มี Spec | ความครอบคลุม |',
  '|---|---:|---:|---:|---:|',
];

for (const featureId of featureIds) {
  const cases = byFeature.get(featureId);
  const counts = summary(featureId, cases);
  const title = cases.values().next().value?.feature ?? featureId;
  const coverage = counts.ids.length ? `${((counts.implemented.length / counts.ids.length) * 100).toFixed(1)}%` : '0%';
  lines.push(`| ${title} | ${counts.ids.length} | ${counts.implemented.length} | ${counts.missing.length} | ${coverage} |`);
}

lines.push('', '## รายละเอียดตามเอกสารต้นทาง', '');
for (const featureId of featureIds) {
  const cases = byFeature.get(featureId);
  const counts = summary(featureId, cases);
  const title = cases.values().next().value?.feature ?? featureId;
  lines.push(`### ${title}`, '', '| TC ID | รายละเอียดตามเอกสาร | Expected Result ตามเอกสาร | สถานะใน Spec | ไฟล์ Spec |', '|---|---|---|---|---|');
  for (const id of counts.ids) {
    const item = cases.get(id);
    const locations = [...(specsById.get(id) ?? [])].sort().join('<br>');
    const status = specsById.has(id) ? 'พบรหัส TC' : 'ยังไม่มี Spec';
    const cells = [id, item.description, item.expected_result, status, locations || '—']
      .map((value) => String(value ?? '—').replaceAll('|', '\\|').replaceAll('\n', '<br>'));
    lines.push(`| ${cells.join(' | ')} |`);
  }
  lines.push('');
}

lines.push('## TC ID ในโค้ดที่ไม่มีในเอกสารต้นทาง', '');
if (codeOnlyIds.length) {
  lines.push('| TC ID | ไฟล์ Spec |', '|---|---|');
  for (const id of codeOnlyIds) {
    lines.push(`| ${id} | ${[...specsById.get(id)].sort().join('<br>')} |`);
  }
} else {
  lines.push('ไม่พบ');
}
lines.push('');
fs.writeFileSync(path.join(root, 'testcases', 'TEST_COVERAGE.md'), lines.join('\n'), 'utf8');

for (const [featureId, cases] of byFeature) {
  const testcasesRoot = path.join(root, 'testcases');
  const directoryName = fs.readdirSync(testcasesRoot, { withFileTypes: true })
    .find((entry) => entry.isDirectory() && entry.name.startsWith(`${featureId}_`))?.name;
  if (!directoryName) continue;
  const directory = path.join(testcasesRoot, directoryName);
  const counts = summary(featureId, cases);
  const title = cases.values().next().value?.feature ?? featureId;
  const report = [
    `# รายงานความสอดคล้องเอกสารกับ Playwright: ${title}`,
    '',
    `- เคสในเอกสารต้นทาง: ${counts.ids.length}`,
    `- พบ TC ID ใน Spec: ${counts.implemented.length}`,
    `- ยังไม่พบใน Spec: ${counts.missing.length}`,
    `- ความครอบคลุมตามรหัส TC: ${counts.ids.length ? ((counts.implemented.length / counts.ids.length) * 100).toFixed(1) : '0.0'}%`,
    '',
    '> การพบรหัสใน Spec ไม่ยืนยันว่า assertion ตรงตาม Expected Result หรือผลทดสอบผ่าน โปรดดู testcases/TEST_COVERAGE.md สำหรับรายละเอียดรายเคสและเคสที่ยังไม่มี Spec.',
    '',
    '| TC ID | รายละเอียดตามเอกสาร | Expected Result | สถานะใน Spec |',
    '|---|---|---|---|',
  ];
  for (const id of counts.ids) {
    const item = cases.get(id);
    const cells = [id, item.description, item.expected_result, specsById.has(id) ? 'พบรหัส TC' : 'ยังไม่มี Spec']
      .map((value) => String(value ?? '—').replaceAll('|', '\\|').replaceAll('\n', '<br>'));
    report.push(`| ${cells.join(' | ')} |`);
  }
  report.push('');
  fs.writeFileSync(path.join(directory, `${featureId}_report.md`), report.join('\n'), 'utf8');
}

console.log(`Generated report for ${totalDocumented} documented cases across ${featureIds.length} functions.`);
console.log(`Spec IDs found: ${implementedDocumented}/${totalDocumented}; missing: ${totalDocumented - implementedDocumented}; undocumented code IDs: ${codeOnlyIds.length}.`);
