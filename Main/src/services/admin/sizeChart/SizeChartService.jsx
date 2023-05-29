import { API } from "helpers/API";

class SizeChartService {
  getSizeChartMaster(sizechartObj) {
    return API.post(`SizeChart/list.json`, sizechartObj);
  }

  createSizeChartMaster(sizechartObj) {
    return API.post(`SizeChart/create.json`, {
      sizeChartModel: sizechartObj,
    });
  }

  getSizeChartMasterByID(id) {
    return API.get(`SizeChart/get/${id}.json`);
  }

  updateSizeChartMaster(sizechartObj) {
    return API.post(`SizeChart/update.json`, {
      sizeChartModel: sizechartObj,
    });
  }

  deleteSizeChartMaster(id) {
    return API.post(`SizeChart/deletesizechartbyid.json`, id);
  }

  updateMultipleStatus(sizechartObj) {
    return API.post(
      `/SizeChart/multipleupdatestatussizechartbyids.json`,
      sizechartObj
    );
  }

  getsizechartdropdownbybrandid(id, storeId = 0) {
    return API.get(`SizeChart/getsizechartdropdownbybrandid/${id}.json`);
    // return API.get(`SizeChart/getsizechartdrop/`);
  }

  getsizechartdropdownbybrandidwithstoreid(id, storeId) {
    return API.get(`SizeChart/getsizechartdropdownforstorebybrandid/${id}/${storeId}.json`);
  }

}

export default new SizeChartService();
