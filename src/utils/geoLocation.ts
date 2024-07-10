import axios from "axios";

export const fetchGeoLocation = async () => {
  try {
    const response = await axios.get("https://geolocation-db.com/json/");
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
