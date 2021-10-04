require('dotenv').config()    // for database login details
const mongoose = require("mongoose")

console.log(process.env.PORT);

connectionString = "mongodb+srv://<username>:<password>@singhscluster.h0e35.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
dbAddress = connectionString.replace("<username>",process.env.MONGO_USERNAME).replace("<password>",process.env.MONGO_PASSWORD)
  
mongoose.connect( dbAddress, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  dbName: "FoodBuddy"
})

const db = mongoose.connection

db.on("error", err => {
  console.error(err);
  process.exit(1)
})

db.once("open", async () => {
  console.log("Mongo connection started on " + db.host + ":" + db.port)
})

require("./food")
