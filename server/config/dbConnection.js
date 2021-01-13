const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((self) => {
    console.log(`Connected to ${self.connection.name}`);
  })
  .catch((err) => {
    console.log(`Àn error occured while connection to the database`);
  });
