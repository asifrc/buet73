//Bismillah

var CONFIG = {
  "DB": {
    "URL": process.env.MONGO_DB || "mongodb://localhost/buet73"
  },
  "SECRET": process.env.SECRET || "tellmeasecret123"
};

module.exports = CONFIG;
