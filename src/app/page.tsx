"user server";
import Teams from "@/app/teams";
import { ResponseTeams } from "@/libs/types";
import axios, { AxiosResponse } from "axios";
export const dynamic = "force-dynamic";

export default async function Home() {
  let teams: AxiosResponse<ResponseTeams, null> | null = null;
  try {
    teams = await axios.get<ResponseTeams>(`${process.env.API_URL}/api/teams`);
  } catch {
    console.error("Failed to fetch teams");
  }
  console.log(teams?.data?.data);
  return (
    <div className="min-h-screen p-8 sm:p-20 font-sans flex">
      <Teams teams={teams?.data?.data ?? []} />
    </div>
  );
}
