import server from "@/lib/utils/server";
import { TeamMember } from "@/types/team.types";

async function getTeamMember(id: string | number): Promise<TeamMember | null> {
  try {
    const request = await server();
    const { data } = await request.get(`/our-team/detail/${id}`);

    return {
      id: Number(id),
      ...data.data,
      files: {
        ourTeamProfilePic: data.data.ourTeamProfilePic.id,
      },
    };
  } catch (error) {
    return null;
  }
}

export default getTeamMember;
