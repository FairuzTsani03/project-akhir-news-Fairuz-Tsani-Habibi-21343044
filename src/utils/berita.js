// berita.js
const axios = require("axios");

const getBerita = async (query) => {
  try {
    const apiKey = "2bfcd684d7fd9d29502637db5ee3c8d6";
    const newsEndpoint = "http://api.mediastack.com/v1/news";

    const response = await axios.get(newsEndpoint, {
      params: {
        access_key: apiKey,
        sources: "liputan6", // Specify the source for Indonesian sports news
        categories: "sports",
        language: "id", // Set language to Indonesian
        q: query || "", // Allow passing a search query
      },
    });

    const berita = response.data.data || [];
    return berita;
  } catch (error) {
    throw new Error("Terjadi kesalahan saat mengambil data berita.");
  }
};

module.exports = getBerita;
