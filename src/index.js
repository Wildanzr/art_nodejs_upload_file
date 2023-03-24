// Import required dependencies
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Menentukan lokasi pengungahhan file
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// Membuat fungsi upload dengan multer
const upload = multer({
  storage: diskStorage,
  limits: {
    fileSize: 1024 * 1024 * 25, // File maksimal 25MB
  },
});

// Membuat fungsi untuk menghapus file
const deleteFile = (file) => {
  fs.unlink(file.path, (err) => {
    if (err) {
      console.error(err);
      throw new Error("Gagal menghapus file");
    }
  });
};

// Membuat aplikasi express
const PORT = 5000; // Best practice gunakan environment variable
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
