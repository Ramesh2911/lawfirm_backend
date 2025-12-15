import pool from "../config/db";

export interface IUser {
  id?: number;
  full_name: string;
  email: string;
  phone: string;
  password: string;
  role?: "client" | "lawyer" | "admin";
}

export interface ILoginUser {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  password: string;
  role: string;
}

export const UserModel = {
  findByEmail: async (email: string) => {
    const [rows]: any = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );
    return rows;
  },

  //Create Client
  createClient: async (user: IUser) => {
    const [result]: any = await pool.query(
      `INSERT INTO users 
       (full_name, email, phone, password, role)
       VALUES (?, ?, ?, ?, 'client')`,
      [user.full_name, user.email, user.phone, user.password]
    );
    return result;
  },

  // Client Login
  clientLogin: async (email: string) => {
    const [rows]: any = await pool.query(
      `SELECT id, full_name, email, phone, password, role
     FROM users
     WHERE email = ? AND status = 1`,
      [email]
    );
    return rows as ILoginUser[];
  },


  updateToken: async (userId: number, token: string) => {
    await pool.query(
      "UPDATE users SET token = ? WHERE id = ?",
      [token, userId]
    );
  },

  //Logout 
  clearToken: async (userId: number) => {
    await pool.query(
      "UPDATE users SET token = NULL WHERE id = ?",
      [userId]
    );
  }
};
