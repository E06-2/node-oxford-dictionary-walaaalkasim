require("dotenv").config();
//console.log(process.env);
const axios = require("axios");

const word = process.argv.slice(2).join(" ");
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

  console.log(`\n-----\nDefinitions of "${word}", as provided by ${metadata.provider}`);
  console.log(usage, "\n-----\n");

}


const treatCategory = (text, categoryData) => {
  const { lexicalEntries } = categoryData

  return text + lexicalEntries.reduce(treatLexicalEntry, "-----\n")
}


const treatLexicalEntry = ( text, lexicalEntry ) => {
  const { entries, lexicalCategory } = lexicalEntry

  return text
      + "\n"
      + lexicalCategory.text
      + entries.reduce(treatEntry, "\n")

}


const treatEntry = ( text, entry ) => {
  const { senses=[] } = entry // prevents error for "so"

  return text + senses.reduce(treatSense, "\n")
}


const treatSense = ( text, sense, index ) => {
  const { definitions } = sense
  const definition = (definitions.length === 1)
  ? definitions[0]
  : definitions.reduce(treatDefinition, "\n")

  return `${text}${index + 1}. ${definition}\n`
}


const treatDefinition = ( text, definition, index ) => {
  return `${text}  ${index + 1}. ${definition}\n`
}


const treatError = (error) => {
  if ( error.response ) {
    // axios error
    const { response } = error
    const { status, statusText } = response

    switch (status) {
      case 404:
        console.log(`⚠\nERROR ${status}: "${word}" ${statusText}⚠`)
        console.log("Please check your spelling\n⚠")
      break
      case 400:
      case 403:
        console.log(`⚠\nERROR ${status}: ${statusText}\nCheck the APP_KEY and APP_ID in your .env file.\n⚠`)
      break
      default:
        console.log(`⚠\nERROR ${status} for "${word}": ${statusText}\n⚠`)
    }

  } else {
    switch (error.code) {
      case 'ERR_HTTP_INVALID_HEADER_VALUE':
        console.log(`⚠\nERROR: ${error.message}`)
        console.log
        ("Check that you have correctly created the .env file.")
        console.log("Get your own key and id here: https://developer.oxforddictionaries.com\n⚠")
      break
      default:
        // script error
        console.log(error);
    }
  }
}


axios(config)
  .then(treatResponse)
  .catch(treatError);
