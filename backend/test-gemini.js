const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config({ path: "g:/Mystica/backend/.env" });

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("GEMINI_API_KEY not found in .env");
        return;
    }
    const genAI = new GoogleGenerativeAI(apiKey);

    try {
        // There isn't a direct listModels method in the client library in the same way 
        // as the REST API unless using a specific service.
        // Let's try to just use 'gemini-1.5-flash-latest' as it's very common.
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Hi");
        console.log("Success with gemini-1.5-flash:", result.response.text());
    } catch (error) {
        console.error("Error:", error.message);
    }
}

listModels();
