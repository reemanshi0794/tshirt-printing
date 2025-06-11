const { callOpenAI } = require("../openAi");



const enrichConcept = async (userInput) => {
  const {topic, description}= userInput;
  console.log("user input", userInput)
  const systemPrompt = `
You are a creative T-shirt concept enhancer. A user provides a raw topic or idea (e.g., "Just Peace"). Your task is to:
1. Evaluate if the topic is visually strong. If not, enrich or rephrase to be more T-shirt-friendly and expressive.
2. If it’s too vague, generic, or text-heavy, suggest 2-3 enriched, visually descriptive alternatives.
3. Otherwise, rephrase the input with more visual clarity or emotional appeal.
Keep it short, punchy, and tailored for maximum impact on T-shirts.

Output format:
If vague:
Original is too vague. Suggested alternatives:
- ...
- ...
- ...
Otherwise:
Enriched Phrase: ...
`;
const userMessage = `Topic: ${topic}\nDescription: ${description}`;

  try {
  const response = await callOpenAI(systemPrompt, userMessage);



    // Basic structure parsing
    if (message.toLowerCase().includes("suggested alternatives")) {
      const suggestions = message
        .split("\n")
        .filter((line) => line.trim().startsWith("-"))
        .map((line) => line.replace(/^[-\s]+/, "").trim());

      return {
        original: topic,
        enriched: null,
        suggestions,
        message,
      };
    } else {
      const match = message.match(/Enriched Phrase:\s*(.+)/i);
      return {
        original: topic,
        enriched: match ? match[1].trim() : topic,
        suggestions: [],
        message,
      };
    }
  } catch (err) {
    console.error("OpenAI Error:", err.message);
    return {
      original: topic,
      enriched: topic,
      suggestions: [],
      error: "Failed to enrich topic",
    };
  }
};

module.exports = enrichConcept;
