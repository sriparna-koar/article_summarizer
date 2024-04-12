// import React, { useState } from 'react';
// import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

// // Use dynamic import to import the youtube-transcript module
// const importYoutubeTranscript = () => import('youtube-transcript');

// // Define your Google API key here
// const GOOGLE_API_KEY = 'AIzaSyDu64kUoe1LORuSMazINc6QG6f_d0qGb6Q';
// const YouTubeTranscriptConverter = () => {
//   const [youtubeLink, setYoutubeLink] = useState('');
//   const [transcript, setTranscript] = useState('');
//   const [summary, setSummary] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const generateSummary = async () => {
//     try {
//       const transcriptText = await extractTranscriptDetails(youtubeLink);
//       const generatedSummary = await generateGeminiContent(transcriptText);
//       setSummary(generatedSummary);
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

//   const extractTranscriptDetails = async (youtubeVideoUrl) => {
//     try {
//       const videoId = youtubeVideoUrl.split('=')[1];
//       // Dynamically import youtube-transcript module
//       const YoutubeTranscript = await importYoutubeTranscript();
//       // Ensure that the module is loaded before accessing its methods
//       if (YoutubeTranscript && YoutubeTranscript.default) {
//         const transcriptText = await YoutubeTranscript.default.getTranscript(videoId);
//         const transcript = transcriptText.map((item) => item.text).join(' ');
//         setTranscript(transcript);
//         return transcript;
//       } else {
//         throw new Error('Failed to load transcript');
//       }
//     } catch (error) {
//       throw error;
//     }
//   };

//   const generateGeminiContent = async (transcriptText) => {
//     try {
//       const model = new GoogleGenerativeAI.GenerativeModel('gemini-pro', {
//         apiKey: GOOGLE_API_KEY,
//       });
//       const response = await model.generateContent(transcriptText);
//       return response.text;
//     } catch (error) {
//       throw error;
//     }
//   };

//   const handleSubmitSummarize = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const response = await fetch('http://localhost:5000/summarize', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ url: youtubeLink }),
//       });
//       const data = await response.json();
//       setSummary(data.summary);
//     } catch (error) {
//       setError('Error summarizing the video. Please try again later.');
//     }
//     setLoading(false);
//   };

//   return (
//     <div>
//       <h1>YouTube Transcript & Video Summarizer</h1>
//       <input
//         type="text"
//         value={youtubeLink}
//         onChange={(e) => setYoutubeLink(e.target.value)}
//         placeholder="Enter YouTube Video Link"
//       />
//       {youtubeLink && (
//         <img src={`http://img.youtube.com/vi/${youtubeLink.split('=')[1]}/0.jpg`} alt="Video Thumbnail" />
//       )}
//       <button onClick={generateSummary}>Get Detailed Notes</button>
//       {summary && (
//         <>
//           <h2>Detailed Notes:</h2>
//           <p>{summary}</p>
//         </>
//       )}

//       <hr />
      
//       <h2>Video Summarization</h2>
//       <form onSubmit={handleSubmitSummarize}>
//         <input 
//           type="text" 
//           placeholder="Enter YouTube Video Link" 
//           value={youtubeLink} 
//           onChange={(e) => setYoutubeLink(e.target.value)} 
//           required 
//         />
//         <button type="submit" disabled={loading}>Summarize Video</button>
//       </form>
//       {loading && <p>Loading...</p>}
//       {error && <p>{error}</p>}
//       {summary && (
//         <div>
//           <h3>Summary</h3>
//           <p>{summary}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default YouTubeTranscriptConverter;



// import React, { useState, useEffect } from 'react';
// import { GoogleGenerativeAI } from "@google/generative-ai";

// const YouTubeTranscript = () => import('youtube-transcript');

// const apiKey = "AIzaSyDu64kUoe1LORuSMazINc6QG6f_d0qGb6Q"; // Replace "YOUR_API_KEY_HERE" with your actual API key

// const gemini = new GoogleGenerativeAI({
//   apiKey: apiKey,
// });

// const App = () => {
//   const [youtubeLink, setYoutubeLink] = useState("");
//   const [transcriptText, setTranscriptText] = useState("");
//   const [summary, setSummary] = useState("");
//   const extractTranscriptDetails = async (youtubeVideoUrl) => {
//     try {
//       const videoId = youtubeVideoUrl.split("=")[1];
//       const transcript = await YouTubeTranscript.getTranscript(videoId);
//       const transcriptText = transcript.map((item) => item.text).join(" ");
//       setTranscriptText(transcriptText);
//     } catch (error) {
//       console.error("Error fetching transcript:", error);
//     }
//   };
  
//   const generateGeminiContent = async () => {
//     try {
//       const response = await gemini.generateContent(prompt + transcriptText);
//       setSummary(response.text);
//     } catch (error) {
//       console.error("Error generating content:", error);
//     }
//   };

//   const handleSubmit = () => {
//     if (youtubeLink) {
//       extractTranscriptDetails(youtubeLink);
//     }
//   };

//   return (
//     <div>
//       <h1>YouTube Transcript to Detailed Notes Converter</h1>
//       <input
//         type="text"
//         value={youtubeLink}
//         onChange={(e) => setYoutubeLink(e.target.value)}
//         placeholder="Enter YouTube Video Link"
//       />
//       <button onClick={handleSubmit}>Get Detailed Notes</button>
//       {youtubeLink && (
//         <img
//           src={`http://img.youtube.com/vi/${youtubeLink.split("=")[1]}/0.jpg`}
//           alt="Video Thumbnail"
//         />
//       )}
//       {summary && (
//         <>
//           <h2>Detailed Notes:</h2>
//           <p>{summary}</p>
//         </>
//       )}
//     </div>
//   );
// };

// export default App;


import React, { useState, useEffect } from 'react';

function App() {
  const [text, setText] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [translationHistory, setTranslationHistory] = useState([]);
  const [url, setUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fileDetails, setFileDetails] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);
  const [devices, setDevices] = useState([]);
  const languageOptions = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'es', name: 'Spanish' }
  ];

  useEffect(() => {
    fetchTranslationHistory();
  }, []);
  const handleFileUpload = async () => {
    const formData = new FormData();
    formData.append('file', fileDetails);
    try {
      const response = await fetch('https://article-summarizer-x3qq.onrender.com/upload', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        console.log('File uploaded:', data.fileDetails);
        // Set the upload result to state
        setUploadResult(data);
      } else {
        throw new Error('File upload failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  // const handleFileUpload = async () => {
  //   const formData = new FormData();
  //   formData.append('file', fileDetails);
  //   try {
  //     const response = await fetch('http://localhost:5000/upload', {
  //       method: 'POST',
  //       body: formData,
  //     });
  //     if (response.ok) {
  //       const data = await response.json();
  //       console.log('File uploaded:', data.fileDetails);
  //     } else {
  //       throw new Error('File upload failed');
  //     }
  //   } catch (error) {
  //     console.error('Error:', error);
  //   }
  // };

  const handleSubmitTranslation = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ q: text, source: 'en', target: targetLanguage, format: 'text' }),
      });
      const data = await response.json();
      const translations = data.data.translations;
      if (translations && translations.length > 0) {
        const translatedText = translations[0].translatedText;
        setTranslatedText(translatedText);
        fetchTranslationHistory(); // Refresh translation history after new translation
      } else {
        setError('No translations found. Please try again.'); // Set error state with a message if translations are not found
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Translation failed. Please try again later.'); // Set error state with a generic message if an error occurs
    }
  };
  
  const fetchTranslationHistory = async () => {
    try {
      const response = await fetch('http://localhost:5000/history');
      const data = await response.json();
      setTranslationHistory(data);
    } catch (error) {
      console.error('Error fetching translation history:', error);
    }
  };
  
  const handleSubmitSummarize = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('https://article-summarizer-x3qq.onrender.com/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      setSummary(data.summary);
    } catch (error) {
      setError('Error summarizing the article. Please try again later.');
    }
    setLoading(false);
  };

  const deleteTranslation = async (id) => {
    try {
      await fetch(`http://localhost:5000/history/${id}`, {
        method: 'DELETE',
      });
      fetchTranslationHistory(); // Refresh translation history after deletion
    } catch (error) {
      console.error('Error deleting translation:', error);
    }
  };

  return (
    <div>
      {/* <div>
        <h1>Translation</h1>
        <form onSubmit={handleSubmitTranslation}>
          <textarea value={text} onChange={(e) => setText(e.target.value)} />
          <select value={targetLanguage} onChange={(e) => setTargetLanguage(e.target.value)}>
            <option value="">Select a language</option>
            {languageOptions.map((lang, index) => (
              <option key={index} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
          <button type="submit">Translate</button>
        </form>
        <div>{translatedText}</div>
        <h2>Translation History</h2>
        <ul>
          {translationHistory.map((translation) => (
            <li key={translation._id}>
              <div>
                <strong>Original Text:</strong> {translation.originalText}
              </div>
              <div>
                <strong>Translated Text:</strong> {translation.translatedText}
              </div>
              <button onClick={() => deleteTranslation(translation._id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div> */}
      <hr />
      <div>
        <h1>Article Summarizer</h1>
        <form onSubmit={handleSubmitSummarize}>
          <input 
            type="text" 
            placeholder="Enter article URL" 
            value={url} 
            onChange={(e) => setUrl(e.target.value)} 
            required 
          />
          <button type="submit" disabled={loading}>Summarize</button>
        </form>
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {summary && (
          <div>
            <h2>Summary</h2>
            <p>{summary}</p>
          </div>
        )}
      </div>
      <hr />
      <div>
      <h1>File Upload</h1>
      <input type="file" onChange={(e) => setFileDetails(e.target.files[0])} />
      <button onClick={handleFileUpload}>Upload</button>

      {uploadResult && (
  <div>
    <h2>Upload Result:</h2>
    <p>Result: {uploadResult.result}</p>
    {/* <p>Value:</p>
          <pre>{uploadResult.value}</pre> */}
    {uploadResult.subScans && (
      <p>Sub Scans Value: {uploadResult.subScans.value}</p>
      
    )}
    {/* Render other properties of uploadResult if needed */}
  </div>
)}

    </div>

    </div>
  );
}

export default App;




// import React, { useState, useEffect } from 'react';

// function App() {
//   const [text, setText] = useState('');
//   const [targetLanguage, setTargetLanguage] = useState('');
//   const [translatedText, setTranslatedText] = useState('');
//   const [translationHistory, setTranslationHistory] = useState([]);
//   const [url, setUrl] = useState('');
//   const [summary, setSummary] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   // Define languageOptions array
//   const languageOptions = [
//     { code: 'en', name: 'English' },
//     { code: 'fr', name: 'French' },
//     { code: 'de', name: 'German' },
//     { code: 'es', name: 'Spanish' }
//     // Add more languages as needed
//   ];

//   useEffect(() => {
//     fetchTranslationHistory();
//   }, []);
//   const handleSubmitTranslation = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch('http://localhost:5000/translate', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ q: text, source: 'en', target: targetLanguage, format: 'text' }),
//       });
//       const data = await response.json();
//       const translations = data.data.translations;
//       if (translations && translations.length > 0) {
//         const translatedText = translations[0].translatedText;
//         setTranslatedText(translatedText);
//         fetchTranslationHistory(); // Refresh translation history after new translation
//       } else {
//         setError('No translations found. Please try again.'); // Set error state with a message if translations are not found
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       setError('Translation failed. Please try again later.'); // Set error state with a generic message if an error occurs
//     }
//   };
  
  
//   const fetchTranslationHistory = async () => {
//     try {
//       const response = await fetch('http://localhost:5000/history');
//       const data = await response.json();
//       setTranslationHistory(data);
//     } catch (error) {
//       console.error('Error fetching translation history:', error);
//     }
//   };
 
  
//   // const handleSubmitTranslation = async (e) => {
//   //   e.preventDefault();
//   //   try {
//   //     const response = await fetch('http://localhost:5000/translate', {
//   //       method: 'POST',
//   //       headers: {
//   //         'Content-Type': 'application/json',
//   //       },
//   //       body: JSON.stringify({ text, to: targetLanguage }),
//   //     });
//   //     const data = await response.json();
//   //     setTranslatedText(data[0].translated);
//   //     fetchTranslationHistory(); // Refresh translation history after new translation
//   //   } catch (error) {
//   //     console.error('Error translating text:', error);
//   //   }
//   // };

//   const handleSubmitSummarize = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const response = await fetch('http://localhost:5000/summarize', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ url }),
//       });
//       const data = await response.json();
//       setSummary(data.summary);
//     } catch (error) {
//       setError('Error summarizing the article. Please try again later.');
//     }
//     setLoading(false);
//   };

//   const deleteTranslation = async (id) => {
//     try {
//       await fetch(`http://localhost:5000/history/${id}`, {
//         method: 'DELETE',
//       });
//       fetchTranslationHistory(); // Refresh translation history after deletion
//     } catch (error) {
//       console.error('Error deleting translation:', error);
//     }
//   };

//   return (
//     <div>
//       <div>
//         <h1>Translation</h1>
//         <form onSubmit={handleSubmitTranslation}>
//           <textarea value={text} onChange={(e) => setText(e.target.value)} />
//           <select value={targetLanguage} onChange={(e) => setTargetLanguage(e.target.value)}>
//             <option value="">Select a language</option>
//             {languageOptions.map((lang, index) => (
//               <option key={index} value={lang.code}>
//                 {lang.name}
//               </option>
//             ))}
//           </select>
//           <button type="submit">Translate</button>
//         </form>
//         <div>{translatedText}</div>
//         <h2>Translation History</h2>
//         <ul>
//           {translationHistory.map((translation) => (
//             <li key={translation._id}>
//               <div>
//                 <strong>Original Text:</strong> {translation.originalText}
//               </div>
//               <div>
//                 <strong>Translated Text:</strong> {translation.translatedText}
//               </div>
//               <button onClick={() => deleteTranslation(translation._id)}>Delete</button>
//             </li>
//           ))}
//         </ul>
//       </div>
//       <hr />
//       <div>
//         <h1>Article Summarizer</h1>
//         <form onSubmit={handleSubmitSummarize}>
//           <input 
//             type="text" 
//             placeholder="Enter article URL" 
//             value={url} 
//             onChange={(e) => setUrl(e.target.value)} 
//             required 
//           />
//           <button type="submit" disabled={loading}>Summarize</button>
//         </form>
//         {loading && <p>Loading...</p>}
//         {error && <p>{error}</p>}
//         {summary && (
//           <div>
//             <h2>Summary</h2>
//             <p>{summary}</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default App;


// import React, { useState, useEffect } from 'react';

// function App() {
//   const [text, setText] = useState('');
//   const [targetLanguage, setTargetLanguage] = useState('');
//   const [translatedText, setTranslatedText] = useState('');
//   const [translationHistory, setTranslationHistory] = useState([]);
  
//   // Define languageOptions array
//   const languageOptions = [
//     { code: 'en', name: 'English' },
//     { code: 'fr', name: 'French' },
//     { code: 'de', name: 'German' },
//     { code: 'es', name: 'Spanish' }
//     // Add more languages as needed
//   ];

//   useEffect(() => {
//     fetchTranslationHistory();
//   }, []);

//   const fetchTranslationHistory = async () => {
//     try {
//       const response = await fetch('http://localhost:5000/history');
//       const data = await response.json();
//       setTranslationHistory(data);
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch('http://localhost:5000/translate', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ text, to: targetLanguage }),
//       });
//       const data = await response.json();
//       setTranslatedText(data[0].translated);
//       fetchTranslationHistory(); // Refresh translation history after new translation
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

//   const deleteTranslation = async (id) => {
//     try {
//       await fetch(`http://localhost:5000/history/${id}`, {
//         method: 'DELETE',
//       });
//       fetchTranslationHistory(); // Refresh translation history after deletion
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

//   return (
//     <div>
//       <form onSubmit={handleSubmit}>
//         <textarea value={text} onChange={(e) => setText(e.target.value)} />
//         <select value={targetLanguage} onChange={(e) => setTargetLanguage(e.target.value)}>
//           <option value="">Select a language</option>
//           {languageOptions.map((lang, index) => (
//             <option key={index} value={lang.code}>
//               {lang.name}
//             </option>
//           ))}
//         </select>
//         <button type="submit">Translate</button>
//       </form>
//       <div>{translatedText}</div>
//       <h2>Translation History</h2>
//       <ul>
//         {translationHistory.map((translation) => (
//           <li key={translation._id}>
//             <div>
//               <strong>Original Text:</strong> {translation.originalText}
//             </div>
//             <div>
//               <strong>Translated Text:</strong> {translation.translatedText}
//             </div>
//             <button onClick={() => deleteTranslation(translation._id)}>Delete</button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default App;
