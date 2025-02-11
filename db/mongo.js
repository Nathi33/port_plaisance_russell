const mongoose = require("mongoose");

const clientOptions = {
  useNewUrlParser: true,
  dbName: "api_russell",
};

exports.initClientDbConnection = async () => {
  try {
    await mongoose.connect(process.env.URL_MONGO, clientOptions);
    console.log("Connected to the database");
  } catch (error) {
    console.log(error);
    throw error;
  }
};
