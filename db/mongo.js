const mongoose = require("mongoose");

const clientOptions = {
  dbName: "api_russell",
};

exports.initClientDbConnection = async () => {
  try {
    await mongoose.connect(process.env.URL_MONGO, clientOptions);
    console.log("Connecté à la base de données MongoDB");
  } catch (error) {
    console.log(error);
    throw error;
  }
};
