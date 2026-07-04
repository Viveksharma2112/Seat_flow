const { MongoClient } = require("mongodb");

const uri =
  "mongodb+srv://vs8026704_db_user:Vivek123123@cluster0.zmlmete.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function test() {
  try {
    const client = new MongoClient(uri);

    await client.connect();

    console.log("Connected Successfully");

    await client.close();
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}

test();