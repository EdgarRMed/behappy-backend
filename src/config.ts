import { config } from "dotenv";
config();

const configuration = {
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost/bhdb",
  PORT: process.env.PORT || 4000,
  SECRET: "beehappy",
};

export default configuration;
