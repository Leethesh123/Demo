const dbConfig = {
  uri: process.env.MONGO_URI || "mongodb://localhost:27017/schoolwebsite",
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
};

module.exports = dbConfig;
