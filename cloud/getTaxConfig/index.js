// Cloud function: getTaxConfig
// Returns city social security config data from cloud database
// Supports version check to avoid unnecessary data transfer

const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();

exports.main = async (event) => {
  const { clientVersion } = event;

  try {
    // Check current version in metadata collection
    const metaRes = await db.collection('tax_metadata').doc('current').get();
    const metadata = metaRes.data;

    // If client already has latest version, skip data transfer
    if (clientVersion && clientVersion === metadata.version) {
      return {
        code: 0,
        needUpdate: false,
        version: metadata.version,
      };
    }

    // Fetch all city configs
    // Cloud DB limit is 100 per query, need pagination
    const countRes = await db.collection('tax_config').count();
    const total = countRes.total;
    const batchSize = 100;
    const batchCount = Math.ceil(total / batchSize);

    const tasks = [];
    for (let i = 0; i < batchCount; i++) {
      tasks.push(
        db.collection('tax_config').skip(i * batchSize).limit(batchSize).get()
      );
    }

    const results = await Promise.all(tasks);
    let cities = {};
    results.forEach((res) => {
      res.data.forEach((city) => {
        cities[city.name] = city;
      });
    });

    return {
      code: 0,
      needUpdate: true,
      version: metadata.version,
      lastUpdate: metadata.lastUpdate,
      data: {
        cities,
        taxConfig: metadata.taxConfig || null,
        bonusBrackets: metadata.bonusBrackets || null,
        bonusCriticalPoints: metadata.bonusCriticalPoints || null,
      },
    };
  } catch (err) {
    console.error('getTaxConfig error:', err);
    return {
      code: -1,
      error: err.message,
      needUpdate: false,
    };
  }
};
