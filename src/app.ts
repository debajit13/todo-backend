import dotenv from 'dotenv';
import morgan from 'morgan';
import connect from './config/database';
connect;
import express, { Express } from 'express';
const app: Express = express();
import YAML from 'yaml';
import swaggerUI from 'swagger-ui-express';
import fs from 'fs';
import cors from 'cors';
import path from 'path';
const swaggerPath = path.resolve(__dirname, '../swagger.yaml');
const file: string = fs.readFileSync(swaggerPath, 'utf8');
const swaggerDocument = YAML.parse(file);
import todoRoutes from './routes/todo';
import authRoutes from './routes/auth';

dotenv.config();
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));
// route to swagger api documentation
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// todo routes
app.use('/api/v1', todoRoutes);

// auth routes
app.use('/api/v1', authRoutes);

export default app;
