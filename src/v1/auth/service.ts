import psqlClient from "conf/db";
import { roles, user, user_roles } from "db/schema";
import { eq } from "drizzle-orm";
import * as jose from "jose";
import { randomUUID } from "node:crypto";
import { z } from "zod";

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
  const result = await psqlClient
    .select({
      id: roles.id,
    })
    .from(roles)
    .where(eq(roles.role_name, role));
  return result[0].id;
};

const checkUserExists = async (email: string) => {
  const result = await psqlClient
    .select({
      id: user.id,
      email: user.email,
      username: user.username,
      role_name: roles.role_name,
    })
    .from(user)
    .where(eq(user.email, email))
    .leftJoin(user_roles, eq(user.id, user_roles.user_id))
    .leftJoin(roles, eq(user_roles.role_id, roles.id));

  if (result.length === 0) {
    return null;
  }
  return result;
};

const createUser = async (
  email: string,
  username: string,
  password: string,
  roleId: number
) => {
  const id = randomUUID();
  z.string().uuid().parse(id); // throws if invalid uuid
  const hashedPassword = await hashPassword(password);
  await psqlClient.transaction(async (trx) => {
    await trx
      .insert(user)
      .values([{ id, email, username, password: hashedPassword }])
      .onConflictDoNothing();
    await trx
      .insert(user_roles)
      .values([{ user_id: id, role_id: roleId }])
      .onConflictDoNothing();
  });
  return id;
};

const getJWT = async (email: string, id: string) => {
  const secret = new TextEncoder().encode(JWT_SECRET);
  const jwt = await new jose.SignJWT({
    email,
    id,
  })
    .setProtectedHeader({ alg: "HS256" })
    .sign(secret);

  return jwt;
};

export { getRoleId, checkUserExists, createUser, getJWT, verifyPassword };
