import { dbPool } from "@/libs/db";
import type { NextApiRequest, NextApiResponse } from "next";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<boolean>
) {
  if (req.method === "POST") {
    const client = await dbPool.connect();
    const { name, role, teamId, isActive } = req.body;
    await client.query(
      `INSERT INTO team_members (name, role, team_id, is_active) VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, role, teamId, isActive]
    );
    client.release();
    res.status(201).send(true);
    return;
  }
  if (req.method === "PUT") {
    const client = await dbPool.connect();
    const { name, role, isActive, id } = req.body;
    await client.query(
      `UPDATE team_members SET name = $1, role = $2, is_active = $3 WHERE id = $4`,
      [name, role, isActive, id]
    );
    client.release();
    res.status(200).send(true);
    return;
  }
  if (req.method === "DELETE") {
    const client = await dbPool.connect();
    const { id } = req.body;
    await client.query(`DELETE FROM team_members WHERE id = $1`, [id]);
    client.release();
    res.status(200).send(true);
    return;
  }
}
