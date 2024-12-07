import { dbPool } from "@/libs/db";
import { ResponseTeamDetail } from "@/libs/types";
import type { NextApiRequest, NextApiResponse } from "next";

interface DbTeam {
  id: string;
  name: string;
  parent_id: string;
  parent_name: string;
  department: string;
}

interface DbTeamMember {
  id: string;
  role: string;
  name: string;
  is_active: boolean;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseTeamDetail | string>
) {
  const teamId = req.query.teamId;

  if (req.method === "PUT") {
    const client = await dbPool.connect();
    const { name, department, parentTeamId } = req.body;
    await client.query(
      `
      UPDATE
        teams
      SET
        name = $1,
        department = $2,
        parent_team_id = $3
      WHERE
        id = $4
    `,
      [name, department, parentTeamId, teamId]
    );
    client.release();
    res.status(200).send("Team updated successfully");
    return;
  }

  if (req.method === "POST") {
    const client = await dbPool.connect();
    const { name, department, parentTeamId } = req.body;
    await client.query(
      `
      INSERT INTO
        teams (name, department, parent_team_id)
      VALUES
        ($1, $2, $3, $4)
    `,
      [name, department, parentTeamId]
    );
    client.release();
    res.status(201).send("Team added successfully");
    return;
  }

  if (req.method === "DELETE") {
    const client = await dbPool.connect();
    const { teamId } = req.body;
    await client.query(
      `
      DELETE FROM
        teams
      WHERE
        id = $1
    `,
      [teamId]
    );
    client.release();
    res.status(200).send("Team deleted successfully");
    return;
  }

  const client = await dbPool.connect();
  const teamQueryResult = await client.query(
    `
    SELECT
      t.id,
      t.name,
      t.department,
      p.id AS parent_id,
      p.name AS parent_name
    FROM
      teams t
    LEFT JOIN teams p ON
      t.parent_team_id = p.id
    WHERE
      t.id = $1
  `,
    [teamId]
  );
  const team: DbTeam = teamQueryResult.rows[0];

  if (!team) {
    res.status(404).send("Team not found");
    return;
  }

  const teamMemberQueryResult = await client.query(
    `
    SELECT
      id,
      role,
      name,
      is_active
    FROM
      team_members
    WHERE
      team_id = $1
  `,
    [teamId]
  );
  client.release();
  const teamMembers: DbTeamMember[] = teamMemberQueryResult.rows;

  res.status(200).json({
    data: {
      id: team.id,
      name: team.name,
      department: team.department,
      parentTeam: {
        id: team.parent_id,
        name: team.parent_name,
      },
      members:
        teamMembers.map((member) => ({
          id: member.id,
          name: member.name,
          isActive: member.is_active,
          role: member.role,
        })) ?? [],
    },
  });
}
