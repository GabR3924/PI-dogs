const axios = require("axios");
const { Temperament } = require("../db.js");

const getTemperaments = async (req, res, next) => {
  const post = (await axios.get(`https://api.thedogapi.com/v1/breeds`)).data;
  const dog = await post.filter(
    (dog) => dog.temperament != null && dog.temperament != undefined
  );

  const temp = await dog.map((dog) => ({
    name: dog.temperament.split(", "),
    id: dog.id,
  }));

  // const temperament = dog.map((dog) => dog.temperament);
  // temperament.sort((a, b) => a.localeCompare(b))
  // res.json(temperament);

  // bueno...podran cuestionar mis metodos
  //pero nunca mis resultados

  const uniqueTemperaments = {};
  const resultArr = [];

  temp.forEach((obj) => {
    obj.name.forEach((temp) => {
      if (!uniqueTemperaments[temp]) {
        uniqueTemperaments[temp] = true;
        resultArr.push({ name: temp });
      }
    });
  });

  const count = await Temperament.count();
  if (count === 0) {
    await Temperament.bulkCreate(resultArr);
    res.json(resultArr.map((temp) => temp.name));
  } else {
    const temps = await Temperament.findAll();
    res.json(temps.map((temp) => temp.name));
  }
};

module.exports = getTemperaments;
