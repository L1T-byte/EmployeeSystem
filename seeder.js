const { MongoClient } = require("mongodb");
const fs = require("fs").promises;
const path = require("path");
//const loading = require("loading-cli");

/**
 * constants
 */
const uri = "mongodb://localhost:27017/data";
const client = new MongoClient(uri);

async function main() {
  try {
    await client.connect();
    const db = client.db();
    const results = await db.collection("employees").find({}).count();

    /**
     * If existing records then delete the current collections
     */
    if (results) {
      db.dropDatabase();
    }


    /**
     * Import the JSON data into the database
     */

    const data = await fs.readFile(path.join(__dirname, "data.json"), "utf8");
    await db.collection("employees").insertMany(JSON.parse(data));

    //displays message when data is imported
    console.info(
      `employees collection set up!`
    );


    process.exit();
  } catch (error) {
    console.error("error:", error);
    process.exit();
  }
}

main();
