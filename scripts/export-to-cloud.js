#!/usr/bin/env node
// Export local tax config data to cloud database JSON import format
// Usage: node scripts/export-to-cloud.js
// Output: cloud/database/tax_config.json, cloud/database/tax_metadata.json

const fs = require('fs');
const path = require('path');

// Mock wx for require
global.wx = {
  getStorageSync: () => null,
  setStorageSync: () => {},
};

const {
  TAX_CONFIG_2026,
  CITY_SOCIAL_CONFIG_2026,
  BONUS_TAX_BRACKETS,
  BONUS_CRITICAL_POINTS,
  DATA_METADATA,
} = require('../src/config/cities-tax-2026');

const outDir = path.join(__dirname, '..', 'cloud', 'database');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Export city configs (one JSON line per record for cloud DB import)
const cityLines = [];
Object.entries(CITY_SOCIAL_CONFIG_2026).forEach(([key, city]) => {
  const record = {
    name: city.name,
    level: city.level,
    socialBase: city.socialBase,
    socialRate: city.socialRate,
    fundRate: city.fundRate,
    totalRate: city.totalRate,
    rentDeduction: city.rentDeduction,
  };
  cityLines.push(JSON.stringify(record));
});

fs.writeFileSync(
  path.join(outDir, 'tax_config.json'),
  cityLines.join('\n') + '\n',
);
console.log(`Exported ${cityLines.length} cities to cloud/database/tax_config.json`);

// Export metadata (single record)
const metadata = {
  _id: 'current',
  version: DATA_METADATA.version,
  lastUpdate: DATA_METADATA.lastUpdate,
  nextScheduledUpdate: DATA_METADATA.nextScheduledUpdate,
  taxConfig: TAX_CONFIG_2026,
  bonusBrackets: BONUS_TAX_BRACKETS,
  bonusCriticalPoints: BONUS_CRITICAL_POINTS,
  dataSource: DATA_METADATA.dataSource,
  cityCount: DATA_METADATA.cityCount,
  coverageProvinces: DATA_METADATA.coverageProvinces,
};

fs.writeFileSync(
  path.join(outDir, 'tax_metadata.json'),
  JSON.stringify(metadata) + '\n',
);
console.log('Exported metadata to cloud/database/tax_metadata.json');

console.log('\nDone! To import into cloud database:');
console.log('1. Open WeChat DevTools -> Cloud Development Console');
console.log('2. Create collection "tax_config", import tax_config.json');
console.log('3. Create collection "tax_metadata", import tax_metadata.json');
