export interface Team {
  id: string;
  name: string;
  subTeams: Team[];
  depth: number;
}

export interface ResponseTeams {
  data: Team[];
}

export interface TeamDetails {
  id: string;
  name: string;
  department: string;
  parentTeam: {
    id: string;
    name: string;
  };
  members: TeamMember[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  isActive: boolean;
}

export interface ResponseTeamDetail {
  data: TeamDetails;
}

export interface TeamListItem {
  id: string;
  name: string;
}

export interface ResponseTeamList {
  data: TeamListItem[];
}
