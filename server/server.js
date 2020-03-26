const express = require("express");
const apirouter = require("./routes");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/", apirouter);

app.listen(process.env.PORT || "8080", () => {
  console.log(`Server is runing on port: ${process.env.PORT || "8080"}`);
});
