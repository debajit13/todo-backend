const mongoose = require('mongoose');

exports.connect = mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log('DB connected Successfully!');
  })
  .catch((error) => {
    console.error('DB connection failed!');
    console.error(error);
    process.exit(1);
  });
