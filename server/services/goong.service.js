import axios from "axios";

const reverseGeocoding = async (lat, lng) => {
  const apiKey = process.env.GOONG_API_KEY;
  const response = await axios.get(
    `https://rsapi.goong.io/Geocode?latlng=${lat},${lng}&api_key=${apiKey}`
  );
  const { results } = response.data;
  return { address: results[0].address };
};

const forwardGeocoding = async (address) => {
  const apiKey = process.env.GOONG_API_KEY;
  const response = await axios.get(
    `https://rsapi.goong.io/geocode?address=${address}&api_key=${apiKey}`
  );
  return response.data;
};

export default {
  reverseGeocoding,
  forwardGeocoding,
};
