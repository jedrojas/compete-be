import mysql from 'mysql';

import { ICompetition } from '../models/competition-model';
import { IUser } from '../models/user-model';
import dbConfig from './db.config';

export const connection = mysql.createConnection({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
  charset: "utf8mb4",
  port: dbConfig.PORT,
});

connection.connect((error) => {
  if (error) {
    throw error;
  }
  console.log("Successfully connected to the database.");
});

export const query = (
  sql: string,
  args?:
    | number
    | string
    | (number | string | Date | undefined)[]
    | IUser
    | ICompetition
    | any[]
) => {
  return new Promise((resolve, reject) => {
    connection.query(sql, args, (err, data) => {
      if (err) {
        return reject(err);
      }

      resolve(data);
    });
  });
};

export default { connection, query };
