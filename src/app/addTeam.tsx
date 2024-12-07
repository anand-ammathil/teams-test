"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface AddTeamProps {
  parentTeamId?: string;
}

export default function AddTeam({ parentTeamId }: AddTeamProps) {
  const router = useRouter();
  const [teamData, setTeamData] = useState({
    name: "",
    parentTeamId: parentTeamId || null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTeamData({
      ...teamData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("teamData", process.env);
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/teams`, teamData);
    setTeamData({ name: "", parentTeamId: parentTeamId || null });
    router.refresh();
  };

  return (
    <div className="mt-2 ml-6">
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <input
          type="text"
          name="name"
          value={teamData.name}
          onChange={handleChange}
          placeholder="New team name"
          required
          className="px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          +
        </button>
      </form>
    </div>
  );
}
