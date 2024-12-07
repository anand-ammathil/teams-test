import { dbPool } from "@/libs/db";
import { ResponseTeamList } from "@/libs/types";
import type { NextApiRequest, NextApiResponse } from "next";

interface DbTeam {
  id: string;
  name: string;
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseTeamList>
) {
  const client = await dbPool.connect();
  const teamsQueryResult = await client.query(
    `
    SELECT
      id,
      name
    FROM
      teams
  `
  );
  client.release();
  const teams: DbTeam[] = teamsQueryResult.rows;

  res.status(200).json({
    data: teams,
  });
}
