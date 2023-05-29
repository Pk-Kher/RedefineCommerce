import { PHPAPI, API, FrontAPI } from "helpers/API";

class TopicsDetailsServices {
  // getTopics(id = 0, topicObj) {
  //   return PHPAPI().post(`topics/list/${id}`, topicObj);
  // }
  getTopics(id = 0, topicObj) {
    if(topicObj === "")
      return API.get(`CmsTopics/list/${id}.json`);
    else
      return API.get(`CmsTopics/list/${id}/${topicObj}.json`);
  }


  getTopicDetails(id = 0) {
    return API.get(`CmsTopics/get/${id}.json`);
  }

  getPublishTopics(storeId) {
    return API.get(`CmsTopicPublish/GetTopic/${storeId}.json`);
  }

  updateTopic(id, topicObj) {
    return API.post(`CmsTopics/update.json`, {"cmsUpdateTopicsModel": topicObj});
  }

  getTopicComponent(id) {
    return API.get(`CmsTopicComponentsController/gettopicomponents/${id}.json`);
  }

  updateTopicComponent(topicObj, id) {
    return API.post(`CmsTopicComponentsController/create.json`, {topicComponentsModel: topicObj});
  }

  updateSingleTopicComponent(topicObj, id) {
    return API.post(`CmsTopicComponentsController/update.json`, {topicComponentsModel: topicObj});
  }

  getPublishTopicComponent(id, type = "preview") {
    return FrontAPI.post(`CmsComponents/getpagecomponents.json`, {"pageId": id, "type": type});
  }

  createTopic(topicObj) {
    return API.post(`CmsTopics/create.json`, {"cmsCreateTopicsModel": topicObj});
  }

  publishPage(topicObj) {
    return API.post(`CmsTopicPublish/Create.json`, {"cmsTopicsPublishModel": topicObj});
  }

  publishTopicComponents(topicObj) {
    return API.post(`CmsTopicComponentsPublishController/create.json`, {"componentsPublishModel": topicObj});
    
  }
}

export default new TopicsDetailsServices();
