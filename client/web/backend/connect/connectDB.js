import mongoose from "mongoose";
mongoose.set("strictQuery", true);

const connectDb = async (url) => {
  try {
    return mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.log(`Error: ${error.message}`);
    return "Something not right with the database";
  }
};

export default connectDb;
