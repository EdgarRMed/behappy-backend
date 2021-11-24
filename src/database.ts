import mongoose, { ConnectOptions } from "mongoose";
import configuration from "./config";

mongoose
    .connect(configuration.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      } as ConnectOptions)
    .then((db) => console.log(`DB is connected`))
    .catch((err) => console.log(err));
