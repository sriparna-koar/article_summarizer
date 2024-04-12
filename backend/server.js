

const express = require('express');
const fetch = require('cross-fetch');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = 5000;

// MongoDB connection
mongoose.connect('mongodb+srv://koarsk03:QTXBdnnZ3kwOgz4f@realestate.466y23n.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const translationSchema = new mongoose.Schema({
  originalText: String,
  targetLanguage: String,
  translatedText: String,
  timestamp: { type: Date, default: Date.now },
});
const Translation = mongoose.model('Translation', translationSchema);

app.use(bodyParser.json());
app.use(cors());



app.post('/translate', async (req, res) => {
  try {
    const { q, source, target, format } = req.body; // Extract parameters from request body
    const response = await fetch('https://google-translator9.p.rapidapi.com/v2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': '0ea7eb1741msh4b6b034aea1c498p16ab8djsnc2e94180977e',
        'X-RapidAPI-Host': 'google-translator9.p.rapidapi.com',
      },
      body: JSON.stringify({ text: q, to: target, from_lang: source }), // Send parameters to Google Translate API
    });

    if (!response.ok) {
      throw new Error(`Request failed with status: ${response.status}`);
    }

    const data = await response.json();
    // Extract translated text from Google Translate API response
    const translatedText = data.data.translations[0].translatedText;

    // Send the translated text as response
    res.json({
      data: {
        translations: [{ translatedText }]
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(400).json({ error: 'Translation failed. Please check your input and try again.' }); // Changed status to 400 and added a more specific error message
  }
});



// Translation endpoint with MongoDB integration
// app.post('/translate', async (req, res) => {
//   try {
//     const { text, to } = req.body;
//     const response = await fetch('https://google-api31.p.rapidapi.com/translate', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'X-RapidAPI-Key': '0ea7eb1741msh4b6b034aea1c498p16ab8djsnc2e94180977e',
//         'X-RapidAPI-Host': 'google-api31.p.rapidapi.com',
//       },
//       body: JSON.stringify({ text, to, from_lang: '' }),
//     });

//     if (!response.ok) {
//       throw new Error(`Request failed with status: ${response.status}`);
//     }

//     const data = await response.json();
//     const translation = new Translation({
//       originalText: text,
//       targetLanguage: to,
//       translatedText: data[0].translated,
//     });
//     await translation.save();
//     res.json(data);
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });
app.post('/summarize', async (req, res) => {
  try {
    const { url } = req.body;
    const response = await fetch(`https://article-extractor-and-summarizer.p.rapidapi.com/summarize?url=${url}&length=3`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '0ea7eb1741msh4b6b034aea1c498p16ab8djsnc2e94180977e',
        'X-RapidAPI-Host': 'article-extractor-and-summarizer.p.rapidapi.com',
      },
    });

    if (!response.ok) {
      throw new Error(`Request failed with status: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Get translation history endpoint
app.get('/history', async (req, res) => {
  try {
    const translations = await Translation.find().sort({ timestamp: -1 });
    res.json(translations);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete translation history endpoint
app.delete('/history/:id', async (req, res) => {
  try {
    await Translation.findByIdAndDelete(req.params.id);
    res.json({ message: 'Translation deleted successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
// Import fetch for Node.js environment

// Function to generate a summary of the file
// function generateFileSummary(fileDetails) {
//   return `File name: ${fileDetails.originalname}, Type: ${fileDetails.mimetype}, Size: ${fileDetails.size} bytes,Value: ${fileDetails.value}`;
// }
function generateFileSummary(fileDetails) {
  const valueAsString = String(fileDetails.value); // Convert value to string
  return `File name: ${fileDetails.originalname}, Type: ${fileDetails.mimetype}, Size: ${fileDetails.size} bytes, Value: ${valueAsString}`;
}

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    // Process the uploaded file (e.g., extract details)
    // const fileDetails = {
    //   originalname: req.file.originalname,
    //   mimetype: req.file.mimetype,
    //   size: req.file.size,
    //   value: req.file.value,
    // };

    // Call OCR API to get subScans data
    const imageUrl = `http://localhost:5000/${req.file.originalname}`; // Assuming the image URL is accessible via localhost
    const ocrResponse = await fetch('https://pen-to-print-handwriting-ocr.p.rapidapi.com/recognize/', {

      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': '0ea7eb1741msh4b6b034aea1c498p16ab8djsnc2e94180977e',
        'X-RapidAPI-Host': 'pen-to-print-handwriting-ocr.p.rapidapi.com',
      },
      body: JSON.stringify({ imageUrl }),
    });

    if (!ocrResponse.ok) {
      throw new Error(`OCR request failed with status: ${ocrResponse.status}`);
    }

    const ocrData = await ocrResponse.json();
    
    // Generate file summary
    // const fileSummary = generateFileSummary(fileDetails);
    const textData = ocrData.result;
    // Respond with the file details, file summary, and OCR data
//     const response = {
//       result: "1",
//       subScans: {
//         value: fileSummary, // Set value based on the summary of the uploaded file
//         // Add other subScan properties here if needed
//       },
//       fileDetails,
//       ocrData
//     };

//     res.json(response);
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });
const fileDetails = {
  originalname: req.file.originalname,
  mimetype: req.file.mimetype,
  size: req.file.size,
  value: textData, // Assign the extracted text data as the value
};
const fileSummary = generateFileSummary(fileDetails);

// Respond with the file details, file summary, and OCR data
const response = {
  result: "1",
  subScans: {
    value: fileSummary, // Set value based on the summary of the uploaded file
    // Add other subScan properties here if needed
  },
  fileDetails,
  ocrData
};

res.json(response);
} catch (error) {
console.error('Error:', error);
res.status(500).json({ error: 'Internal Server Error' });
}
});
// app.post('/upload', upload.single('file'), async (req, res) => {
//   try {
//     // Process the uploaded file (e.g., extract details)
//     const fileDetails = {
//       originalname: req.file.originalname,
//       mimetype: req.file.mimetype,
//       size: req.file.size,
//     };
//     // Respond with the file details
//     res.json({ message: 'File uploaded successfully', fileDetails });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// app.post('/handwriting-ocr', async (req, res) => {
//   try {
//     const { imageUrl } = req.body;
//     const response = await fetch('https://pen-to-print-handwriting-ocr.p.rapidapi.com/recognize/', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'X-RapidAPI-Key': '0ea7eb1741msh4b6b034aea1c498p16ab8djsnc2e94180977e',
//         'X-RapidAPI-Host': 'pen-to-print-handwriting-ocr.p.rapidapi.com',
//       },
//       body: JSON.stringify({ imageUrl }),
//     });
//     if (!response.ok) {
//       throw new Error(`OCR request failed with status: ${response.status}`);
//     }
//     const data = await response.json();
//     res.json(data);
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));












// const express = require('express');
// const { google } = require('googleapis');
// const youtubeTranscript = require('youtube-transcript');
// const dotenv = require('dotenv');

// dotenv.config();

// const app = express();
// const port = process.env.PORT || 3000;

// const language = google.language({
//   version: 'v1',
//   auth: process.env.GOOGLE_API_KEY,
// });

// const prompt = `You are Youtube video summarizer.`;
// async function extractTranscriptDetails(youtubeTranscript, youtubeVideoUrl) {
//   try {
//     const videoId = youtubeVideoUrl.split('=')[1];
//     const transcriptText = await youtubeTranscript.default.getTranscript(videoId);
//     const transcript = transcriptText.map(item => item.text).join(' ');
//     return transcript;
//   } catch (error) {
//     throw error;
//   }
// }

// async function generateSummary(transcriptText) {
//   try {
//     const response = await language.documents.analyzeEntities({
//       document: {
//         content: transcriptText,
//         type: 'PLAIN_TEXT',
//       },
//     });
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// }

// app.get('/', (req, res) => {
//   res.send('Welcome to YouTube Transcript Summarizer');
// });

// app.get('/getSummary', async (req, res) => {
//   try {
//     const { youtubeLink } = req.query;
//     if (!youtubeLink) {
//       return res.status(400).json({ error: 'YouTube link is required' });
//     }

//     const transcriptText = await extractTranscriptDetails(youtubeTranscript, youtubeLink);
//     if (!transcriptText) {
//       return res.status(400).json({ error: 'Unable to fetch transcript text' });
//     }

//     const summary = await generateSummary(prompt + transcriptText);
//     res.json({ summary });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'An error occurred' });
//   }
// });

// app.listen(port, () => {
//   console.log(`App listening at http://localhost:${port}`);
// });


// const express = require('express');
// const { google } = require('googleapis');
// const dotenv = require('dotenv');
// const YouTubeTranscript = require('youtube-transcript');

// dotenv.config();

// const app = express();
// const port = process.env.PORT || 3000;

// const language = google.language({
//   version: 'v1',
//   auth: process.env.GOOGLE_API_KEY,
// });

// const prompt = `You are Youtube video summarizer.`;

// async function generateSummary(transcriptText) {
//   try {
//     const response = await language.documents.analyzeEntities({
//       document: {
//         content: transcriptText,
//         type: 'PLAIN_TEXT',
//       },
//     });
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// }
// function validateYouTubeUrl(url) {
//   var regExp =
//     /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;
//   return regExp.test(url);
// }

// async function getTranscript(videoURL) {
//   try {
//     const transcript = await YouTubeTranscript.automatic(videoURL);
//     return transcript;
//   } catch (error) {
//     throw new Error('Unable to fetch transcript.');
//   }
// }


// app.get('/', (req, res) => {
//   res.send('Welcome to YouTube Transcript Summarizer');
// });

// app.get('/getSummary', async (req, res) => {
//   try {
//     const { youtubeLink } = req.query;
//     if (!youtubeLink) {
//       return res.status(400).json({ error: 'YouTube link is required' });
//     }

//     const transcriptText = await getTranscript(youtubeLink);
//     if (!transcriptText) {
//       return res.status(400).json({ error: 'Unable to fetch transcript text' });
//     }

//     const summary = await generateSummary(prompt + transcriptText);
//     res.json({ summary });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'An error occurred' });
//   }
// });

// app.listen(port, () => {
//   console.log(`App listening at http://localhost:${port}`);
// });
