const axios = require("axios");
const { Dog } = require("../db.js");

// const KEY = "4112b5b83f03.904cc4f8ebddc19b6f94";
const URL = "https://api.thedogapi.com/v1/breedsi";


const getAllDogs = async (req, res, next) => {
  try {
    const response = await axios.get("https://api.thedogapi.com/v1/breeds");
    const names = response.data?.map((dog) => dog.name);
    res.status(200).json({ dogs: names });
  } catch (error) {
    next(error);
  }
};

const getDogById = async (req, res, next) => {
  const { idRaza } = req.params

  try {
    const response = await axios.get(`https://api.thedogapi.com/v1/breeds/${idRaza}`);
    const data = response.data;
    res.status(200).json({ data })
  } catch (error) {
    next(error)
  }
};

const getDogByRaza = async (req, res, next) => {};

const createDog = async (req, res, next) => {
  const { name, height_min, height_max, weight_min, weight_max, life_span, imagen } = req.body

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

    res.json(newDog)
  } catch (error) {
    next(error)
  }
};


module.exports = {
  getAllDogs,
  getDogById,
  createDog
};
