"use client";

import { TeamMember } from "@/libs/types";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface EditTeamMemberProps {
  member: TeamMember;
  teamId: string;
}

export default function EditTeamMember({
  member,
  teamId,
}: EditTeamMemberProps) {
  const [memberData, setMemberData] = useState({
    name: member.name,
    role: member.role,
    isActive: member.isActive,
  });
  const router = useRouter();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setMemberData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/api/teams/${teamId}/members`,
      {
        name: memberData.name,
        role: memberData.role,
        isActive: memberData.isActive,
        id: member.id,
      }
    );
    router.refresh();
  };

  const handleDelete = async () => {
    const re = confirm("Are you sure you want to delete this member?");
    if (!re) return;
    await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/api/teams/${teamId}/members`,
      {
        data: { id: member.id },
      }
    );
    router.refresh();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 border rounded-lg shadow-md bg-white max-w-lg mx-auto"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
            <input
              type="text"
              name="name"
              value={memberData.name || ""}
              onChange={handleChange}
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
          type="button"
          className="px-3 py-1 bg-red-600 text-white rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 mr-2"
          onClick={handleDelete}
        >
          Delete
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Save
        </button>
      </div>
    </form>
  );
}
