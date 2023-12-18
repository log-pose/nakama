import mysql from "mysql2";

const DATABASE_URL: string = process.env.DATABASE_URL as string;

const conn = mysql.createConnection(DATABASE_URL);

import logger from "./logger";

conn.connect((err) => {
  if (err) {
    logger.error(err);
    return;
  }
  logger.info("Connected to database");
});

const executeQuery = (query: string) => {
  return new Promise((resolve, reject) => {
    conn.query(query, (err: any, results: any) => {
      if (err) {
        logger.error(err);
        reject(err);
      }
      resolve(results);
    });
  });
};

const executeQueryWithParams = (query: string, params: any[]) => {
  return new Promise((resolve, reject) => {
    conn.query(query, params, (err: any, results: any) => {
      if (err) {
        logger.error(err);
        reject(err);
      }
      resolve(results);
    });
  });
};

interface Query {
  query: string;
  params: any[];
}

const executeTransaction = (queries: Query[]): Promise<any> => {
  return new Promise((resolve, reject) => {
    conn.beginTransaction((err) => {
      if (err) {
        logger.error(err);
        return reject(err);
      }

      const executeQuery = (index: number): void => {
        if (index >= queries.length) {
          conn.commit((err) => {
            if (err) {
              logger.error(err);
              return conn.rollback(() => reject(err));
            }
            return resolve(true);
          });
        } else {
          const query = queries[index];
          conn.query(query.query, query.params, (err, results) => {
            if (err) {
              logger.error(err);
              return conn.rollback(() => reject(err));
            }
            executeQuery(index + 1);
          });
        }
      };

      executeQuery(0);
    });
  });
};

export { executeQuery, executeQueryWithParams, executeTransaction };
