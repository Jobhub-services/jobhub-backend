import 'reflect-metadata';
import { config as dotenvConfig } from 'dotenv';
const NODE_ENV = process.env.NODE_ENV || 'development';
dotenvConfig({ path: `.env.${NODE_ENV}` });

import { connect, set } from 'mongoose';
import express, { json } from 'express';
import cors from 'cors';
const app = express();
app.use(json());
app.use(cors());

console.log('here we go');
