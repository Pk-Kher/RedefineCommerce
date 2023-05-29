import { PHPAPI } from "helpers/API";

class SportService {
  getSports(SportsObj) {
    const pageIndex = SportsObj.args.pageIndex;
    return PHPAPI().post(`sport/list/paginate?page=${pageIndex}`, SportsObj);
  }
  
  createSport(SportsObj) {
    return PHPAPI().post(`sport/create`, SportsObj);
  }

  getSportByID(id) {
    return PHPAPI().post(`sport/list?id=${id}`);
  }
  
  updateSport(SportsObj) {
    return PHPAPI().post(`sport/update`, SportsObj);
  }

  updateStatus(SportsObj) {
    return PHPAPI().post(`sport/update/status`, SportsObj);
  }
}

export default new SportService();
