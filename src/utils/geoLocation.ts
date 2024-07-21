import axios from "axios";

export const fetchGeoLocation = async () => {
  try {
    // const response = await axios.get("https://geolocation-db.com/json/");
    // console.log(response.data);
    const fakeIpDetails = {
      country_code: "US",
      country_name: "United States",
      city: "New York",
      postal: "10001",
      latitude: 40.7128,
      longitude: -74.006,
      IPv4: "192.168.1.1",
      state: "NY",
    };
    return fakeIpDetails;
  } catch (error) {
    console.error(error);
  }
};
