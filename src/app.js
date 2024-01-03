const express = require("express");
const hbs = require("hbs");
const path = require("path");
const axios = require("axios");
const geocode = require("./utils/geocode");
const forecast = require("./utils/prediksiCuaca");
const getberita = require("./utils/berita");
// console.log(__dirname)
// console.log(__filename)
// console.log(path.join(__dirname, '../public'))

const app = express();
const port = process.env.PORT || 3000;
//Define paths for Express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

//handlebars engine and view location
app.set("view engine", "hbs");
app.set("views", viewPath);
hbs.registerPartials(partialsPath);

//setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get("", (req, res) => {
  res.render("index", {
    title: "Aplikasi Cek Cuaca",
    name: "Fairuz Tsani Habibi",
  });
});

app.get("/tentang", (req, res) => {
  res.render("tentang", {
    title: "Tentang Saya",
    name: "Fairuz Tsani Habibi",
  });
});

app.get("/bantuan", (req, res) => {
  res.render("bantuan", {
    title: "Bantuan",
    teksBantuan: "Bantuan apa yang anda butuhkan?",
    name: "Fairuz Tsani Habibi",
  });
});

app.get("/infocuaca", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "Kamu harus memasukan lokasi yang ingin dicari",
    });
  }
  geocode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      if (error) {
        return res.send({ error });
      }
      forecast(latitude, longitude, (error, dataPrediksi) => {
        if (error) {
          return res.send({ error });
        }
        res.send({
          prediksiCuaca: dataPrediksi,
          lokasi: location,
          address: req.query.address,
        });
      });
    }
  );
});

app.get("/berita", async (req, res) => {
  try {
    const urlApiMediaStack = "http://api.mediastack.com/v1/news";
    const apiKey = "2bfcd684d7fd9d29502637db5ee3c8d6"; // Ganti dengan kunci API Anda
    const category = "sports"; // Kategori olahraga
    const topics = "soccer,futsal"; // Topik berita: sepak bola dan futsal

    const params = {
      access_key: apiKey,
      category: category,
      topics: topics,
      language: "en", // Menambahkan parameter language dengan nilai "en"
      country: "id", // Menambahkan parameter country dengan nilai "id" untuk Indonesia
    };

    const response = await axios.get(urlApiMediaStack, { params });
    const dataBeritaOlahraga = response.data;

    res.render("berita", {
      title: "Berita Olahraga Indonesia",
      name: "Fairuz Tsani Habibi",
      berita: dataBeritaOlahraga.data,
    });
  } catch (error) {
    console.error(error);
    res.render("error", {
      judul: "Terjadi Kesalahan",
      pesanKesalahan: "Terjadi kesalahan saat mengambil berita olahraga.",
    });
  }
});

app.get("/bantuan/*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Fairuz Tsani Habibi",
    pesanError: "Belum ada artikel bantuan tersedia",
  });
});

app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Fairuz Tsani Habibi",
    pesanError: "Halaman tidak ditemukan",
  });
});

app.listen(port, () => {
  console.log("Server is running on port " + port);
});
