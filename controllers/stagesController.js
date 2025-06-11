const {
  enrichConcept,
  classifyCategory,
  selectModel,
  generateImagePrompt,
  extractMetadata,
} = require("../services");
const TshirtDesign = require("../models/TshirtDesign");
const { v4: uuidv4 } = require("uuid");

const processDesignPrompt = async (req, res) => {
  const { userInput, socketId } = req.body;
  console.log("request",req.body)
  const io = req.app.get('io');

  try {
    const emitProgress = (stage, message) => {
      if (socketId && io) {
        io.to(socketId).emit('progress', { stage, message });
      }
    };

    emitProgress(1, "Enhancing concept...");
    const enrichedConcept = await enrichConcept(userInput);

    emitProgress(2, "Classifying category...");
    const category = await classifyCategory(enrichedConcept);

    emitProgress(3, "Selecting model...");
    const model = await selectModel(category);

    emitProgress(4, "Generating image prompt...");
    const imagePrompt = await generateImagePrompt(
      enrichedConcept,
      category,
      model
    );

    emitProgress(5, "Generating image...");
    const imagePath = await generateImageFromAPI(imagePrompt, model);

    emitProgress(6, "Uploading to S3...");
    const imageUrl = await uploadToS3(imagePath, "your-bucket-name");

    emitProgress(7, "Extracting metadata...");
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

    emitProgress(8, "Saving design...");
    const savedDesign = await saveMetadata(metadata, imageUrl);

    emitProgress(9, "Complete!");
    res.json({ success: true, design: savedDesign });
  } catch (error) {
    console.error("Error processing prompt:", error);
    res.status(500).json({ success: false, error: "Failed to process prompt." });
  }
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
