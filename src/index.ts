import dotenv from 'dotenv';
import app from './app';

dotenv.config();

app.listen(process.env.PORT, () => {
  console.log(`Server is running at PORT: ${process.env.PORT}`);
});
