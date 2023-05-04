const { Router } = require("express");
const { getAllDogs, getDogById, createDog, getDogByName } = require("../controllers/dog.controller.js");
const  getTemperaments  = require("../controllers/temperament.controller.js");
// const getDogById = require("../controllers/dog.controller.js")
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.get("/dogs", getAllDogs);

router.get("/dogs/:idRaza", getDogById);

// router.get("/dogs/:name", getAllDogs);

// router.get("/dogs/search-dogs  ", getDogByName);

router.post("/dogs", createDog);

router.get("/temperaments", getTemperaments);

module.exports = router;
