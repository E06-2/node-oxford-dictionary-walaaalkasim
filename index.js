require("dotenv").config();
//console.log(process.env);
const axios = require("axios");

const word = process.argv.slice(2); //use npm index.js happy///or any word you want
const app_key = process.env.APP_KEY;
const app_id = process.env.APP_ID;


const config = {
  method: 'get',
  url: `https://od-api.oxforddictionaries.com/api/v2/entries/en/${word}?fields=definitions`,
  headers: {
    app_id: app_id,
    app_key: app_key,
  }
}


const treatResponse = ({ data }) => {
  const { metadata, results } = data

  const usage = results.reduce(treatCategory, "")

  console.log(`Definitions of "${word}", as provided by ${metadata.provider}`);
  console.log(usage);

}


const treatCategory = (text, categoryData) => {
  // console.log("**************\ncategoryData:", categoryData);

  const { lexicalEntries } = categoryData

  return text + lexicalEntries.reduce(treatLexicalEntry, "-----\n")
}


const treatLexicalEntry = ( text, lexicalEntry ) => {
  // console.log("************\nlexicalEntry:", lexicalEntry);

  const { entries, lexicalCategory } = lexicalEntry


  return text
      + lexicalCategory.text
      + entries.reduce(treatEntry, "\n")

}


const treatEntry = ( text, entry ) => {
  // console.log("**********\nentry:", entry);

  const { senses } = entry

  return text + senses.reduce(treatSense, "\n")

}


const treatSense = ( text, sense, index ) => {
  // console.log("********\nsense:", sense);

  const { definitions } = sense
  const definition = (definitions.length === 1)
  ? definitions[0]
  : definitions.reduce(treatDefinition, "\n")

  return `${text}${index + 1}. ${definition}\n`
}


const treatDefinition = ( text, definition, index ) => {
  // console.log("*****\sdefinition:", definition);

  return `${text}  ${index + 1}. ${definition}\n`
}


const treatError = (error) => {
  console.log(error);
}


axios(config)
  .then(treatResponse)
  .catch(treatError);
