// Cloud function: updateTaxConfig
// Admin function to update city social security data in cloud database
// Usage: update single city, batch update, or bump version

const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();

exports.main = async (event) => {
  const { action, data } = event;

  try {
    switch (action) {
      // Update a single city's config
      case 'updateCity': {
        const { cityName, config } = data;
        await db.collection('tax_config').where({ name: cityName }).update({
          data: config,
        });
        return { code: 0, message: `Updated ${cityName}` };
      }

      // Batch update multiple cities
      case 'batchUpdate': {
        const { cities } = data;
        const tasks = Object.entries(cities).map(([name, config]) =>
          db.collection('tax_config').where({ name }).update({ data: config })
        );
        await Promise.all(tasks);
        return { code: 0, message: `Updated ${Object.keys(cities).length} cities` };
      }

      // Bump version to trigger client refresh
      case 'bumpVersion': {
        const { version, lastUpdate } = data;
        await db.collection('tax_metadata').doc('current').update({
          data: {
            version,
            lastUpdate: lastUpdate || new Date().toISOString().split('T')[0],
          },
        });
        return { code: 0, message: `Version bumped to ${version}` };
      }

      default:
        return { code: -1, message: `Unknown action: ${action}` };
    }
  } catch (err) {
    console.error('updateTaxConfig error:', err);
    return { code: -1, error: err.message };
  }
};
