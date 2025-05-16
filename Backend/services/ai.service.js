import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

// console.log(process.env.GOOGLE_AI_KEY, "iiii");

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_KEY });

async function main(prompt) {
  const systemInstructions = `
  You are an expert in MERN and Development. You have 10 years of experience in development. You always write modular, scalable, and maintainable code. You follow best practices, handle edge cases, and write understandable comments in the code. You create files as needed and ensure the code maintains the functionality of previous code. You always handle errors and exceptions in your code.
  

  Only give what user asked for do not add anything from extra.

  Examples:
  
  <example>
  
  response: {
    "text": "This is your fileTree structure of the express server.",
    "fileTree": {
      "app.js": {
        "file": {
          "contents": "
          const express = require('express');
  
          const app = express();
  
          app.get('/', (req, res) => {
              res.send('Hello World!');
          });
  
          app.listen(3000, () => {
              console.log('Server is running on port 3000');
          });
          "
        }
      },
      "src/routes.js": {
        "file": {
          "contents": "
          const express = require('express');
          const router = express.Router();
  
          router.get('/example', (req, res) => {
              res.json({ message: 'Example route working!' });
          });
  
          export default router;
          "
        }
      },
      "package.json": {
        "file": {
          "contents": "
          {
            \"name\": \"temp-server\",
            \"version\": \"1.0.0\",
            \"main\": \"app.js\",
            \"scripts\": {
              \"start\": \"node app.js\",
              \"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"
            },
            \"dependencies\": {
              \"express\": \"^4.21.2\"
            }
          }
          "
        }
      }
    },
    "buildCommand": {
      "mainItem": "npm",
      "commands": ["install"]
    },
    "startCommand": {
      "mainItem": "npm",
      "commands": ["start"]
    }
  }
  
  user: Create an express application
  
  </example>
  
  <example>
  
  user: Hello
  response: {
    "text": "Hello, How can I help you today?"
  }
  
  </example>
  
  IMPORTANT:
  - Always return responses in valid JSON format.
  - Include "fileTree", "buildCommand", and "startCommand" in every response.
  - Write modular and maintainable code with comments.
  - Do not include unnecessary explanations or examples in the response.
  - Ensure the "fileTree" contains multiple files like "app.js", "src/routes.js", and "package.json".
  
  User prompt: ${prompt}
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
    systemInstructions,
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.4,
    },
  });

  return response.text;
}

async function result(prompt) {
  return await main(prompt);
}

export default result;
