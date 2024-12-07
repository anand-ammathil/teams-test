"use client";

import { TeamDetails, TeamListItem } from "@/libs/types";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface EditTeamDetailsProps {
  team: TeamDetails;
  availableTeams: TeamListItem[];
}

export default function EditTeamDetails({
  team,
  availableTeams,
}: EditTeamDetailsProps) {
  const [formData, setFormData] = useState<{
    name: string;
    department: string;
    parentTeamId: string;
  }>({
    department: team.department,
    name: team.name,
    parentTeamId: team.parentTeam?.id || "",
  });
  availableTeams = availableTeams.filter((t) => t.id !== team.id);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "parentTeam") {
      const selectedTeam = availableTeams.find((t) => t.id === value);
      setFormData((prev) => ({
        ...prev,
        parentTeamId: selectedTeam?.id || "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/teams/${team.id}`, {
      name: formData.name,
      department: formData.department,
      parentTeamId: formData.parentTeamId || null,
    });
    router.refresh();
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex space-x-4">
          <div className="flex-1">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Team Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex-1">
            <label
              htmlFor="department"
              className="block text-sm font-medium text-gray-700"
            >
              Department
            </label>
            <input
              type="text"
              id="department"
              name="department"
              value={formData.department || ""}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex-1">
            <label
              htmlFor="parentTeam"
              className="block text-sm font-medium text-gray-700"
            >
              Parent Team
            </label>
            <select
              id="parentTeam"
              name="parentTeam"
              value={formData.parentTeamId}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">No Parent Team</option>
              {availableTeams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
