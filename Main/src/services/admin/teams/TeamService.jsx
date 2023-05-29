import { PHPAPI } from "helpers/API";

class TeamService {
  getTeams(TeamsObj) {
    const pageIndex = TeamsObj.args.pageIndex;
    return PHPAPI().post(`team/list/paginate?page=${pageIndex}`, TeamsObj);
  }
  
  createTeam(TeamsObj) {
    return PHPAPI().post(`team/create`, TeamsObj);
  }

  getTeamByID(id) {
    return PHPAPI().post(`team/list?id=${id}`);
  }
  
  updateTeam(TeamsObj) {
    return PHPAPI().post(`team/update`, TeamsObj);
  }

  updateStatus(TeamsObj) {
    return PHPAPI().post(`team/update/status`, TeamsObj);
  }
}

export default new TeamService();
