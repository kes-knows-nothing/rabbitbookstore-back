const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");

mongoose.connect("mongodb+srv://alicedevkes:olOYb3xdy6g1NyvY@cluster0.yfiw8ba.mongodb.net/?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    stock: { type: Number, required: true },
    author: { type: String, required: true},
    categoryName: { type: String, required: true },
    imgPath : { type: String, required: true},
    publishDate: { type: String, required: true }
  });

const Product = mongoose.model("Product", productSchema);

async function fakeUserData() {
  for (let i = 1; i < 30; i++) {
    const product = {
      name: faker.lorem.words(),
      price: faker.number.int({ min: 10000, max: 30000 }),
      description: faker.lorem.sentence(),
      stock: faker.number.int({ max: 100 }),
      author: faker.lorem.words(),
      categoryName: faker.helpers.arrayElement(["novel", "poetry", "Sci-fi"]),
      
    };
    await Product.create(product);
  }
}

fakeUserData();