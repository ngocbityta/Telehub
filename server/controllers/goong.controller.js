import goongService from "../services/goong.service.js";

const reverseGeocoding = async (req, res) => {
  const { lat, lng } = req.body;

  try {
    const result = await goongService.reverseGeocoding(lat, lng);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error reverse geocoding goong:", error);
    return res
      .sendStatus(500)
      .json({ message: error.message || "Internal Server Error" });
  }
};
const forwardGeocoding = async (req, res) => {
  const { address } = req.body;

  try {
    const result = await goongService.forwardGeocoding(address);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error forward geocoding goong:", error);
    return res
      .sendStatus(500)
      .json({ message: error.message || "Internal Server Error" });
  }
};

export default {
  reverseGeocoding,
  forwardGeocoding,
};
