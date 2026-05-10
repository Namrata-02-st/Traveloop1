const app = require('./app');
const { sequelize } = require('./models');
require('dotenv').config();

const port = Number(process.env.PORT || 5000);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: false });
    app.listen(port, () => {
      console.log(`Traveloop API running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Failed to start Traveloop API:', err.message);
    process.exit(1);
  }
};

start();
