import axios from "axios";

export const fetchGeoLocation = async () => {
  const response = await axios.get("https://geolocation-db.com/json/");
  return response.data;
};
