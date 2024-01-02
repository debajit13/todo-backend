import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();

const MONGO_URL: string = process.env.MONGO_URL || '';

const connect = mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log('DB connected Successfully!');
  })
  .catch((error) => {
    console.error('DB connection failed!');
    console.error(error);
    process.exit(1);
  });
export default connect;
