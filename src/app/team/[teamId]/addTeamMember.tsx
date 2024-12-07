"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface AddTeamMemberProps {
  teamId: string;
}

export default function AddTeamMember({ teamId }: AddTeamMemberProps) {
  const [memberData, setMemberData] = useState({
    name: "",
    role: "",
    isActive: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setMemberData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/teams/${teamId}/members`,
      {
        name: memberData.name,
        role: memberData.role,
        isActive: memberData.isActive,
        teamId: teamId,
      }
    );
    router.refresh();
    setMemberData({
      name: "",
      role: "",
      isActive: true,
    });
  };

  return (
    <div className="p-6 border rounded-lg shadow-md bg-white max-w-lg mx-auto mt-5">
      <h2 className="text-2xl font-bold text-center mb-6">
        Add New Team Member
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
              <input
                type="text"
                name="name"
                value={memberData.name || ""}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
              <input
                type="text"
                name="role"
                value={memberData.role || ""}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </label>
          </div>
          <div className="flex items-center justify-end">
            <label className="inline-flex items-center text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                name="isActive"
                checked={memberData.isActive}
                onChange={handleChange}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <span className="ml-2">Active</span>
            </label>
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Add Member
          </button>
        </div>
      </form>
    </div>
  );
}
