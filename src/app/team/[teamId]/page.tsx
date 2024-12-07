import { ResponseTeamDetail, ResponseTeamList } from "@/libs/types";
import axios from "axios";
import Link from "next/link";
import AddTeamMember from "./addTeamMember";
import EditTeamDetails from "./editTeamDetails";
import EditTeamMember from "./editTeamMember";

export default async function EditTeam({
  params,
}: {
  params: Promise<{ teamId: string }>;
}) {
  const teamId = (await params).teamId;
  const {
    data: { data: team },
  } = await axios.get<ResponseTeamDetail>(
    `${process.env.API_URL}/api/teams/${teamId}`
  );
  const {
    data: { data: availableTeams },
  } = await axios.get<ResponseTeamList>(
    `${process.env.API_URL}/api/teams/list`
  );
  return (
    <div>
      <div className="max-w-2xl mx-auto p-4">
        <Link
          href="/"
          className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 inline-block"
        >
          {"<"}
        </Link>
        <h1 className="text-2xl font-bold mb-6">Edit Team Details</h1>
      </div>
      <EditTeamDetails team={team} availableTeams={availableTeams} />
      <div className="space-y-4">
        {team.members.map((member) => (
          <EditTeamMember key={member.id} member={member} teamId={teamId} />
        ))}
      </div>
      <AddTeamMember teamId={teamId} />
    </div>
  );
}
