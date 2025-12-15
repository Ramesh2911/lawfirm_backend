import pool from "../config/db";

interface CreateCaseInput {
    client_id: number;
    case_name: string;
    description: string;
    price: number;
    preferred_contact: string;
    contact_value: string;
}

const CaseModel = {
    createCase: async (data: CreateCaseInput) => {
        const sql = `
      INSERT INTO cases 
      (client_id, lawyer_id, case_name, description, price, preferred_contact, contact_value, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

        const values = [
            data.client_id,
            2,
            data.case_name,
            data.description,
            data.price,
            data.preferred_contact,
            data.contact_value,
            0,
        ];

        const [result] = await pool.execute(sql, values);
        return result;
    },
    getAllCases: async () => {
        const sql = `SELECT * FROM cases ORDER BY created_at DESC`;
        const [rows] = await pool.execute(sql);
        return rows;
    },
    getCasesByClient: async (client_id: number) => {
        const sql = `SELECT * FROM cases WHERE client_id = ? ORDER BY created_at DESC`;
        const [rows] = await pool.execute(sql, [client_id]);
        return rows;
    },
};

export default CaseModel;
