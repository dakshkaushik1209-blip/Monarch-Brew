// NOTE: This is a SAMPLE data structure to be populated per cafe. Real team members will be listed here.

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  photo?: string;
  bio?: string;
}

// Left empty by default so no fake names or invented people are rendered
export const teamMembers: TeamMember[] = [];
