import mongoose from "mongoose";

mongoose.connect("mongodb+srv://epik1219:nEvC9uxoBzi5jCQ5@cluster0.k6qu4pb.mongodb.net/?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

const handleOpen = () => console.log("Connected to DB 👍");
db.on("error", (error) => console.log("DB Error", error));
db.once("open", handleOpen);
