const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors"); // Asegúrate de haber importado cors

// Crear una instancia de Express
const app = express();

// Configuración CORS
app.use(
  cors({
    origin: "http://localhost:5173", // Asegúrate de que este sea el puerto de tu frontend
    methods: ["GET", "POST", "PUT", "DELETE"], // Métodos permitidos
    allowedHeaders: ["Content-Type"], // Encabezados permitidos
  })
);

// Usar bodyParser para manejar las peticiones JSON
app.use(bodyParser.json());

// Ruta al archivo donde se almacenarán los usuarios
const usersFilePath = path.join(__dirname, "users.json");

// Leer los usuarios desde el archivo JSON
const readUsersFromFile = () => {
  try {
    const data = fs.readFileSync(usersFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return []; // Si no existe el archivo, retornamos un arreglo vacío
  }
};

// Guardar los usuarios en el archivo JSON
const saveUsersToFile = (users) => {
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), "utf-8");
  } catch (error) {
    console.error("Error al guardar los usuarios", error);
  }
};

// Rutas para manejar usuarios
app.get("/api/usuarios", (req, res) => {
  const users = readUsersFromFile();
  res.json(users);
});

app.post("/api/usuarios", (req, res) => {
  const newUser = req.body;
  const users = readUsersFromFile();
  users.push(newUser);
  saveUsersToFile(users);
  res.status(201).json(newUser);
});

app.put("/api/usuarios/:nombre_usuario", (req, res) => {
  const { nombre_usuario } = req.params;
  const { pago } = req.body;
  const users = readUsersFromFile();
  const userIndex = users.findIndex(
    (user) => user.nombre_usuario === nombre_usuario
  );
  if (userIndex === -1) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }
  users[userIndex].pago = pago;
  saveUsersToFile(users);
  res.json(users[userIndex]);
});

app.delete("/api/usuarios/:nombre_usuario", (req, res) => {
  const { nombre_usuario } = req.params;
  let users = readUsersFromFile();
  users = users.filter((user) => user.nombre_usuario !== nombre_usuario);
  saveUsersToFile(users);
  res.status(204).send();
});

// Configuración del servidor para escuchar en un puerto
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
