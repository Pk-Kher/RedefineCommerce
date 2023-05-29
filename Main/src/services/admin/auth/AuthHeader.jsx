// done

export default function authHeader() {
  const token = localStorage.getItem("token");
  if (token) {
    return { Authorization: "Bearer " + JSON.parse(token), Accept: "application/json" };
  } else {
    return {};
  }
}
