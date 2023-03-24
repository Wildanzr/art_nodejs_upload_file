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

const acceptedFileTypes = [
  "image/jpeg",
  "image/png",
  "image/svg+xml",
  "video/mp4",
  "video/quicktime",
  "video/webm",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
];

const validateFileTypes = (file) => {
  if (!acceptedFileTypes.includes(file.mimetype)) {
    return false;
  }
  return true;
};

// Membuat aplikasi express
const PORT = 5000; // Best practice gunakan environment variable
const HOST = "http://localhost"; // Best practice gunakan environment variable
const app = express();
app.use(express.json());

app.post("/uploads", upload.single("file"), (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({
      message: "File tidak ditemukan",
    });
  } else if (!validateFileTypes(file)) {
    deleteFile(file);
    return res.status(400).json({
      message: "Format file tidak didukung",
    });
  }

  return res.status(200).json({
    message: "File berhasil diunggah",
    data: {
      url: `${HOST}:${PORT}/uploads/${file.filename}`,
    },
  });
});

app.get("/uploads/:filename", (req, res) => {
  const file = req.params.filename;
  const filePath = path.join(__dirname, "uploads", file);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      message: "File tidak ditemukan",
    });
  }

  return res.sendFile(filePath);
});

app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
