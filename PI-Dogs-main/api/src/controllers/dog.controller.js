const axios = require("axios");
const { Dog, Temperament } = require("../db.js");

// const KEY = "4112b5b83f03.904cc4f8ebddc19b6f94";
// const URL = "https://api.thedogapi.com/v1/breedsi";

const getAllDogs = async (req, res, next) => {
  const { name } = req.query
  try {
    const response = await axios.get("https://api.thedogapi.com/v1/breeds");
    const apiDogs = response.data?.map((dog) => ({
      id: dog.id,
      image: dog.image,
      name: dog.name,
      height: dog.height,
      weight: dog.weight,
      life_span: dog.life_span,
      temperament: dog.temperament,
    }));

    const dbDogs = await Dog.findAll();

    const allDogs = [...apiDogs, ...dbDogs];

    allDogs.sort((a, b) => a.name.localeCompare(b.name));
    if (name) {
      const dogFilter = allDogs.filter((dog) =>
        dog.name.toLowerCase().includes(name.toLowerCase())
      );
      if (dogFilter.length > 0) {
        res.json({ dogs: dogFilter });
      }
    } else {
      res.json({ dogs: allDogs });
    }

  } catch (error) {
    next(error);
  }
};

const getDogById = async (req, res, next) => {
  const { idRaza } = req.params;
  console.log(idRaza);

  try {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const isValidUuid = uuidRegex.test(idRaza);

    if (isValidUuid) {
      // idRaza is a valid UUID, so we can use it to search the database
      const dog = await Dog.findByPk(idRaza);
      if (dog) {
        // If we find the dog in the database, we return it
      } else {
        // If we don't find the dog in the database, we search the external API
        const response = await axios.get(
          `https://api.thedogapi.com/v1/breeds/${idRaza}`
        );
        const apiData = response.data;
        if (apiData) {
          // If we find the dog in the external API, we return it
          res.status(200).json({ data: apiData });
        } else {
          // If we don't find the dog in either the database or the external API, we return an error
          throw new Error("No se encontró el perro");
        }
      }
    } else {
      // idRaza is not a valid UUID, so we search the external API directly
      const response = await axios.get(
        `https://api.thedogapi.com/v1/breeds/${idRaza}`
      );
      const apiData = response.data;
      if (apiData) {
        // If we find the dog in the external API, we return it
        res.status(200).json({ data: apiData });
      } else {
        // If we don't find the dog in either the database or the external API, we return an error
        throw new Error("No se encontró el perro");
      }
    }
  } catch (error) {
    next(error);
  }
};

// const getDogByName = async (req, res, next) => {
//     let misperros = await Dog.findAll()
//     let misperrosParse = []    
//     for (let i = 0; i < misperros.length; i++) {
//         let perrito = misperros[i];
//         let temperaments = await perrito.getTemperaments() 
//         perrito = perrito.dataValues;
//         temperaments = temperaments.map((el) => el.dataValues.name)
//         perrito.temperament = temperaments.toString()
//         misperrosParse.push(perrito)
//     }
//     axios.get(`https://api.thedogapi.com/v1/breeds`)
//         .then(respuesta => {
//             let resultado = [...misperrosParse, ...respuesta.data].filter((el) => 
//                 el.name.toLowerCase().includes(req.query.name.toLowerCase()))
//             if (resultado.length === 0) {
//                 res.send([])
//             }
//             if(resultado.length > 0 && resultado.length < 9) {
//                 res.send(resultado)
//             }
//             else if(resultado.length > 8) {
//                 let nuevoarray = resultado.slice(0, 8)
//                 res.send(nuevoarray)
//             } 
//             res.end()
//         })        
//         .catch(error => {
//             console.log(error)

//         })
// };


const createDog = async (req, res, next) => {
  const {
    name,
    height_min,
    height_max,
    weight_min,
    weight_max,
    life_span,
    imagen,
    temperaments,
  } = req.body;

  try {
    const newDog = await Dog.create({
      name,
      height_min,
      height_max,
      weight_min,
      weight_max,
      life_span,
      imagen,
    });

    if (temperaments) {
      // Verificamos que los ID de los temperamentos son válidos
      const validTemperaments = await Temperament.findAll({
        where: { id: temperaments },
      });
      if (validTemperaments.length !== temperaments.length) {
        throw new Error(
          "Algunos de los temperamentos especificados no existen en la base de datos"
        );
      }
      await newDog.addTemperaments(temperaments);
    }

    const dogWithTemperaments = await Dog.findByPk(newDog.id, {
      include: Temperament,
    });

    res.json(dogWithTemperaments);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDogs,
  getDogById,
  // getDogByName,
  createDog,
};
