import { API } from "helpers/API";
class BlobUploadService {
    getFilesByPath(pathName) {
        return API.get(`/Blob/GetFilesByrootname.json?FolderPath=${pathName}`);
    }
}
export default new BlobUploadService();
