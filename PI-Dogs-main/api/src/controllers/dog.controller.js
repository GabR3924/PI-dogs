const axios = require("axios");
const { Dog, Temperament } = require("../db.js");

// const KEY = "4112b5b83f03.904cc4f8ebddc19b6f94";
// const URL = "https://api.thedogapi.com/v1/breedsi";


const getAllDogs = async (req, res, next) => {
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
    }));;
    
    const dbDogs = await Dog.findAll()

    const allDogs = [...apiDogs, ...dbDogs];

    allDogs.sort((a, b) => a.name.localeCompare(b.name));


    res.status(200).json({ dogs: allDogs });
  } catch (error) {
    next(error);
  }
};

const getDogById = async (req, res, next) => {
  const { idRaza } = req.params

  try {
    // Buscamos el perro en la base de datos utilizando el UUID
    const dog = await Dog.findByPk(idRaza);
    if (dog) {
      // Si encontramos el perro en la base de datos, lo devolvemos
      res.status(200).json(dog)
    } else {
      // Si no encontramos el perro en la base de datos, buscamos en la API
      const response = await axios.get(`https://api.thedogapi.com/v1/breeds/${idRaza}`);
      const apiData = response.data;
      if (apiData) {
        // Si encontramos el perro en la API, lo devolvemos
        res.status(200).json({ data: apiData })
      } else {
        // Si no encontramos el perro ni en la base de datos ni en la API, devolvemos un error
        throw new Error('No se encontró el perro');
      }
    }
  } catch (error) {
    next(error)
  }
};


const getDogByName = async (req, res, next) => {
  // console.log('hola');
  // const dogName = req.query.q;
  // console.log('dogName:', dogName);
  // if (!dogName) {
  //   res.status(400).send('Missing dog name');
  //   return;
  // }

  // // Search the API
  // const apiResponse = await axios.get(`https://api.thedogapi.com/v1/breeds/search?q=${dogName}`);
  // const apiDog = apiResponse.data;

  // // Search the database
  // // Replace this with your own database query
  // const dbDog = await Dog.find({name: new RegExp(dogName, 'i')}); // Example: await BreedModel.find({) name: new RegExp(breedName, 'i') });

  // // Combine and return the results
  // const dogs = [...apiDog, ...dbDog];
  // if (dogs.length === 0) {
  //   res.status(404).send('Dog not found');
  //   return;
  // }
  res.json("hola");

 };

const createDog = async (req, res, next) => {
  const { name, height_min, height_max, weight_min, weight_max, life_span, imagen, temperaments } = req.body

  try {
    const newDog = await Dog.create({
      name,
      height_min,
      height_max,
      weight_min,
      weight_max,
      life_span,
      imagen
    })

    if (temperaments) {
      // Verificamos que los ID de los temperamentos son válidos
      const validTemperaments = await Temperament.findAll({
        where: { id: temperaments }
      });
      if (validTemperaments.length !== temperaments.length) {
        throw new Error('Algunos de los temperamentos especificados no existen en la base de datos');
      }
      await newDog.addTemperaments(temperaments);
    }

    const dogWithTemperaments = await Dog.findByPk(newDog.id, {
      include: Temperament
    });

    res.json(dogWithTemperaments)
  } catch (error) {
    next(error)
  }
};


module.exports = {
  getAllDogs,
  getDogById,
  getDogByName,
  createDog
};
