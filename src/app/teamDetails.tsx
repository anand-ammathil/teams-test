import { ResponseTeamDetail, Team } from "@/libs/types";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useSWR from "swr";

export default function TeamDetails({
  selectedTeam,
  resetSelection,
}: {
  selectedTeam: Team;
  resetSelection: (teamId: null) => void;
}) {
  const { data, error, isLoading } = useSWR<ResponseTeamDetail>(
    `team/${selectedTeam.id}`,
    () =>
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/api/teams/${selectedTeam.id}`)
        .then((res) => res.data)
  );

  const router = useRouter();

  const handleDelete = async () => {
    const confirmDelete = confirm("Are you sure you want to delete this team?");
    if (!confirmDelete) return;
    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/teams`, {
      data: { id: selectedTeam.id },
    });
    router.refresh();
    resetSelection(null);
  };

  return (
    <div className="w-2/3 pl-4">
      <div className="mb-8">
        <div className="flex space-x-4">
          <h2 className="text-3xl font-bold">{selectedTeam.name}</h2>
          <Link
            href={`/team/${selectedTeam.id}`}
            className="inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Edit Team
          </Link>
          <button
            className="py-2 px-3 text-red-600 border border-red-600 rounded hover:bg-red-50"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error loading team details</p>}
      {data && (
        <>
          <h3 className="text-xl font-semibold mb-2">Details</h3>
          <div className="mb-4 p-4 border rounded shadow-sm bg-gray-50">
            <p className="mb-1">
              <strong>Parent Team:</strong>{" "}
              {data.data.parentTeam.name || "None"}
            </p>
            <p className="mb-1">
              <strong>Department:</strong> {data.data.department}
            </p>
          </div>
          <h3 className="text-xl font-semibold mb-2">Members</h3>
          {data.data.members.length === 0 ? (
            <p className="mb-4">No members found</p>
          ) : (
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b">ID</th>
                  <th className="py-2 px-4 border-b">Name</th>
                  <th className="py-2 px-4 border-b">Active</th>
                </tr>
              </thead>
              <tbody>
                {data.data.members.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{member.id}</td>
                    <td className="border px-4 py-2">{member.name}</td>
                    <td className="border px-4 py-2">
                      {member.isActive ? "Yes" : "No"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}
