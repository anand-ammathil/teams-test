import { dbPool } from "@/libs/db";
import { ResponseTeams, Team } from "@/libs/types";
import type { NextApiRequest, NextApiResponse } from "next";

interface DbTeamStructure {
  team_id: string;
  team_name: string;
  parent_teams: {
    team_id: string;
    team_name: string;
  }[];
  depth: number;
}

interface TeamsMap {
  [key: string]: {
    team_id: string;
    team_name: string;
    sub_teams: TeamsMap;
    depth: number;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseTeams | boolean>
) {
  if (req.method === "POST") {
    const client = await dbPool.connect();
    const { name, parent_team_id, department } = req.body;
    await client.query(
      `INSERT INTO teams (name, parent_team_id, department) VALUES ($1, $2, $3) RETURNING *`,
      [name, parent_team_id, department]
    );
    client.release();
    res.status(201).send(true);
    return;
  }

  if (req.method === "DELETE") {
    const client = await dbPool.connect();
    const { id } = req.body;
    await client.query(`DELETE FROM teams WHERE id = $1`, [id]);
    client.release();
    res.status(200).send(true);
    return;
  }
  const client = await dbPool.connect();
  const queryResult = await client.query(`
    WITH RECURSIVE team_structure AS (
        SELECT
            id AS team_id,
            name AS team_name,
            parent_team_id,
            '[]'::jsonb AS parent_teams,
            0 AS depth
        FROM teams
        WHERE parent_team_id IS NULL

        UNION ALL

        SELECT
            t.id AS team_id,
            t.name AS team_name,
            t.parent_team_id,
            ts.parent_teams || jsonb_build_object('team_id', ts.team_id, 'team_name', ts.team_name) AS parent_teams,
            ts.depth + 1 AS depth
        FROM teams t
        INNER JOIN team_structure ts ON t.parent_team_id = ts.team_id
    )
    SELECT
        *
    FROM team_structure
  `);
  client.release();
  const dbTeams: DbTeamStructure[] = queryResult.rows;

  const mappedTeams: TeamsMap = {};
  dbTeams.forEach((team) => {
    let currentLevel = mappedTeams;
    team.parent_teams.forEach((parent) => {
      if (!currentLevel[parent.team_id]) {
        currentLevel[parent.team_id] = {
          team_id: parent.team_id,
          team_name: parent.team_name,
          sub_teams: {},
          depth: 1,
        };
      }
      currentLevel = currentLevel[parent.team_id].sub_teams;
    });
    if (!currentLevel[team.team_id]) {
      currentLevel[team.team_id] = {
        team_id: team.team_id,
        team_name: team.team_name,
        sub_teams: {},
        depth: team.depth,
      };
    }
  });

  res.status(200).json({ data: mapToResponse(mappedTeams) });
}

const mapToResponse = (teams: TeamsMap): Team[] => {
  const responseTeams: Team[] = [];
  Object.keys(teams).forEach((teamId) => {
    const team = teams[teamId];
    responseTeams.push({
      id: team.team_id,
      name: team.team_name,
      depth: team.depth,
      subTeams: mapToResponse(team.sub_teams),
    });
  });
  return responseTeams;
};
