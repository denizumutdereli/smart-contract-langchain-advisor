import { config } from 'dotenv';
process.env.NODE_ENV = process.env.NODE_ENV === undefined ? 'production' : process.env.NODE_ENV;
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });
