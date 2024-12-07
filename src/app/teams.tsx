"use client";
import { Team } from "@/libs/types";
import { useState } from "react";
import AddTeam from "./addTeam";
import TeamDetails from "./teamDetails";

const TeamHierarchy: React.FC<{
  team: Team;
  onSelect: (team: Team) => void;
}> = ({ team, onSelect }) => {
  const currentPath = `- ${team.name}`;

  return (
    <div className="ml-8">
      <h3 onClick={() => onSelect(team)} className="cursor-pointer">
        {currentPath}
      </h3>
      {team.subTeams.map((subTeam) => (
        <TeamHierarchy key={subTeam.id} team={subTeam} onSelect={onSelect} />
      ))}
    </div>
  );
};

export default function Teams({
  teams,
}: Readonly<{
  teams: Team[];
}>) {
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  return (
    <>
      <div className="w-1/6 border-r pr-4">
        <h1 className="text-2xl font-bold mb-8">Team Hierarchy</h1>

        {teams.map((team) => (
          <TeamHierarchy key={team.id} team={team} onSelect={setSelectedTeam} />
        ))}
        <AddTeam />
      </div>
      {selectedTeam ? (
        <TeamDetails
          selectedTeam={selectedTeam}
          resetSelection={setSelectedTeam}
        />
      ) : (
        <p>Select a team to see the details</p>
      )}
    </>
  );
}
