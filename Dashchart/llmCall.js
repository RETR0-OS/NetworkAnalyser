import { HfInference } from "@huggingface/inference";

const client = new HfInference("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");

async function processJSONWithLlama(jsonData, prompt) {
  let out = "";
  
  // Combine the JSON data and prompt into a single object
  const inputData = {
    prompt: prompt,
    data: jsonData
  };

  const stream = await client.chatCompletionStream({
    model: "meta-llama/Llama-3.1-8B-Instruct",
    messages: [
      { role: "user", content: JSON.stringify(inputData) }
    ],
    max_tokens: 1000  // Increased token limit to handle more data
  });

  for await (const chunk of stream) {
    if (chunk.choices && chunk.choices.length > 0) {
      const newContent = chunk.choices[0].delta.content;
      out += newContent;
      console.log(newContent);
    }
  }

  return out;
}

// Example usage
const jsonData = [
  // Your 50 data rows here
  { "id": 1, "name": "John Doe", "age": 30 },
  { "id": 2, "name": "Jane Smith", "age": 25 },
  // ... (48 more objects)
];

const prompt = "Analyze this data and provide insights on age distribution and any interesting patterns.";

async function main() {
  try {
    const result = await processJSONWithLlama(jsonData, prompt);
    console.log("Final Result:", result);
  } catch (error) {
    console.error("Error:", error);
  }
}

main();