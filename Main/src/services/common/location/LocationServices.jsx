import axios from "axios";

class Location {
    getLocation() {
        return axios.get("https://ipapi.co/120.72.90.155/json/");
    }
}

export default new Location();
