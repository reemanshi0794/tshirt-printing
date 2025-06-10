const {
  enhanceConcept,
  classifyCategory,
  selectModel,
  generateImagePrompt,
  extractMetadata,
} = require("../services");
const TshirtDesign = require("../models/TshirtDesign");

const { v4: uuidv4 } = require("uuid");

const processDesignPrompt = async (req, res) => {
  const { userInput } = req.body;

  // Stage 1: Enhance concept using GPT (your prompt logic here)
  const enrichedConcept = await enhanceConcept(userInput);

  // Stage 2: Categorize
  const category = await classifyCategory(enrichedConcept);

  // Stage 3: Select model
  const model = await selectModel(category);

  // Stage 4: Generate image prompt
  const imagePrompt = await generateImagePrompt(
    enrichedConcept,
    category,
    model
  );

  // Stage 5: Generate Image via model API (e.g. Replicate / SD)
  const imagePath = await generateImageFromAPI(imagePrompt, model);

  // Upload to S3
  const imageUrl = await uploadToS3(imagePath, "your-bucket-name");

  // Metadata
  const metadata = {
    id: uuidv4(),
    title: enrichedConcept,
    originalTopic: userInput,
    category,
    selectedModel: model.name,
    imagePrompt,
    tags: extractTags(enrichedConcept),
    mood: inferMood(enrichedConcept),
    style: getArtStyle(category),
    version: 1,
  };

  // Save to DB
  const savedDesign = await saveMetadata(metadata, imageUrl);

  res.json({ success: true, design: savedDesign });
};

async function saveMetadata(metadata, imageUrl) {
  const doc = new TshirtDesign({
    ...metadata,
    imageUrl,
  });

  await doc.save();
  return doc;
}

module.exports = { processDesignPrompt };
