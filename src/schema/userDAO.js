const { User } = require("./model");

const userDAO = {
  async create({ name, email, password, permission }) {
    const user = new User({ name, email, password, permission });
    await user.save();

    return user.toObject();
  },

  async findOne(id) {
    const plainUser = await User.findById(id).lean();
    return plainUser;
  },

  async findOneByEmail(email) {
    const plainUsers = await User.find({ email }).lean();
    return plainUsers.length > 0 ? plainUsers[0] : null;
  },
};

module.exports = userDAO;
