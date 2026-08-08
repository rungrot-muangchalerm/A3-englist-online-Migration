const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const mysql2 = require('mysql2');

const dbOptions = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'mydb',
};

const storeOptions = {
  ...dbOptions,
  createDatabaseTable: true,
  expiration: 86400000, // 24 hours
  schema: {
    tableName: 'tbl_x_sessions',
    columnNames: {
      session_id: 'session_id',
      expires: 'expires',
      data: 'data',
    },
  },
};

const connection = mysql2.createPool(dbOptions);
const sessionStore = new MySQLStore(storeOptions, connection);

const sessionMiddleware = session({
  key: 'eol.sid',
  secret: process.env.JWT_SECRET || 'dev-secret-change-me',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  },
});

module.exports = sessionMiddleware;
