const axios = require('axios');

module.exports = {
  queryGPT,
};

/*
  It's now direct to openai apis but over a python flask api which is extended by lanchain and vectordb embeddings context
*/

async function queryGPT(messages) {
  try {
    const response = await axios.post('http://127.0.0.1:5000/ask', {
      query: messages
    });

    return response.data;
  } catch (error) {
    console.error("Error querying Flask API:", error.message);
    console.log(error.response ? error.response.data : error);

  }
}


