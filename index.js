require("dotenv").config();
//console.log(process.env);
const axios = require("axios");

const word = process.argv.slice(2).join(" "); //use node index.js happy///or any word you want
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
    console.log(
      "definitions of",
      word,
      "provided by",
      response.data.metadata.provider
    );
    def.map((item, index) => {
      const defItem = item.definitions;
      console.log(index + 1, ".", defItem.toString());
    });
    console.log("  ");
  })
  .catch(function (error) {
    if (error.response.data) {
      console.log(
        "an error occured which is:",
        error.response.data,
        "status :",
        error.response.status
      );
    } else {
      console.log(error);
    }
  });
