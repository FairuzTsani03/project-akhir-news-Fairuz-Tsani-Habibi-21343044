const axios = require("axios");

const getBerita = async () => {
  try {
    const apiKey = "2bfcd684d7fd9d29502637db5ee3c8d6";
    const newsEndpoint = "http://api.mediastack.com/v1/news";

    const response = await axios.get(newsEndpoint, {
      params: {
        access_key: apiKey,
        sources: "id",
        categories: "sports",
        language: "id",
      },
    });

    const berita = response.data.data || [];
    return berita;
  } catch (error) {
    throw new Error("Terjadi kesalahan saat mengambil data berita.");
  }
};

module.exports = getBerita;
