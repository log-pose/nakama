import {
  executeQuery,
  executeQueryWithParams,
  executeTransaction,
} from "conf/db";
import * as jose from "jose";
import { randomUUID } from "node:crypto";

const JWT_SECRET = process.env.JWT_SECRET as string;

const hashPassword = async (password: string) => {
  return await Bun.password.hash(password, {
    algorithm: "bcrypt",
    cost: 4,
  });
};

const verifyPassword = async (password: string) => {
  const hash = await Bun.password.hash(password);
  return await Bun.password.verify(password, hash);
};

const getRoleId = async (role: string) => {
  const query = `SELECT id FROM Roles WHERE role_name = '${role}'`;
  const result: any = await executeQuery(query);
  if (result.length === 0) {
    return -1;
  }
  return parseInt(result[0].id);
};

const checkUserExists = async (email: string) => {
  const query = `SELECT u.username, r.role_name FROM Users as u 
                  JOIN UserRoles as ur ON u.id = ur.user_id 
                  JOIN Roles as r ON ur.role_id = r.id
                  WHERE u.email = ?`;
  const result: any = await executeQueryWithParams(query, [email]);
  if (result.length === 0) {
    return null;
  }
  return result[0];
};

const createUser = async (
  email: string,
  username: string,
  password: string,
  roleId: number
) => {
  const id = randomUUID();
  const hashedPassword = await hashPassword(password);
  const createUserQuery = `INSERT INTO Users (id,email, username, password_hash) VALUES (?,?, ?,?)`;
  const createUserParams = [id, email, username, hashedPassword];
  const createRoleQuery = `INSERT INTO UserRoles (user_id, role_id) VALUES (?, ?)`;
  const createRoleParams = [id, roleId];

  const queries = [
    { query: createUserQuery, params: createUserParams },
    { query: createRoleQuery, params: createRoleParams },
  ];

  return await executeTransaction(queries);
};

const getJWT = async (email: string) => {
  const secret = new TextEncoder().encode(JWT_SECRET);
  const jwt = await new jose.SignJWT({
    email,
  })
    .setProtectedHeader({ alg: "HS256" })
    .sign(secret);

  return jwt;
};

export { getRoleId, checkUserExists, createUser, getJWT, verifyPassword };
