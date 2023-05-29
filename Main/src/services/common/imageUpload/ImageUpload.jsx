import { API } from "helpers/API";

class ImageUpload {
  uploadImage(imagePath, imageObj) {
    return API.post(`/upload/image?folderPath=${imagePath}`, imageObj);
  }
  deleteImage(imagePath) {
    return API.get(`/delete/file?folderPath=${imagePath}`);
  }
}

export default new ImageUpload();
