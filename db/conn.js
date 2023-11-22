const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("toughts", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

try {
  sequelize.authenticate();
  console.log("Conectamos com Sucesso!");
} catch (err) {
  console.log(`Não foi possível Conectar: ${err}`);
}

module.exports = sequelize;
