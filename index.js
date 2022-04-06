require("dotenv").config();
//console.log(process.env);
const axios = require("axios");

const word = process.argv.slice(2); //use npm index.js happy///or any word you want
const app_key = process.env.APP_KEY;
const app_id = process.env.APP_ID;
axios
  .get(
    `https://od-api.oxforddictionaries.com/api/v2/entries/en/${word}?fields=definitions`,

    {
      // Accept: "application/json",
      headers: {
        app_id: app_id,
        app_key: app_key,
      },
    }
  )
  .then(function (response) {
    const def = response.data.results[0].lexicalEntries[0].entries[0].senses;
    def.map((item, index) => {
      const defItem = item.definitions;
      console.log(index + 1, ".", defItem.toString());
    });
    console.log("  ");
    console.log("provided by", response.data.metadata.provider);
  })
  .catch(function (error) {
    console.log(error);
  });
