import mongoose from "mongoose";

mongoose.connect("mongodb+srv://alicedevkes:olOYb3xdy6g1NyvY@cluster0.yfiw8ba.mongodb.net/?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

const handleOpen = () => console.log("Connected to DB 👍");
db.on("error", (error) => console.log("DB Error", error));
db.once("open", handleOpen);
