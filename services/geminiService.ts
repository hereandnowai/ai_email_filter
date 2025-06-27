
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Sentiment } from '../types';
import { GEMINI_MODEL_TEXT } from '../constants';

// Ensure API_KEY is accessed correctly.
const apiKey = process.env.API_KEY;
if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY") {
  console.warn(
    "Gemini API key is not configured. Please set the API_KEY environment variable or update it in index.tsx for local testing. AI features will not work."
  );
}
const ai = new GoogleGenAI({ apiKey: apiKey || "DISABLED_KEY_PLACEHOLDER" });

const parseJsonFromMarkdown = <T,>(jsonString: string): T | null => {
  let cleanedJsonString = jsonString.trim();
  const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
  const match = cleanedJsonString.match(fenceRegex);
  if (match && match[2]) {
    cleanedJsonString = match[2].trim();
  }
  try {
    return JSON.parse(cleanedJsonString) as T;
  } catch (e) {
    console.error("Failed to parse JSON response from Gemini:", e, "Original string:", jsonString);
    if (!cleanedJsonString.startsWith("{") && !cleanedJsonString.startsWith("[")) {
      // @ts-ignore
      return cleanedJsonString as T;
    }
    return null;
  }
};

const makeApiCallWithRetry = async <T extends GenerateContentResponse>(
  apiCall: () => Promise<T>, 
  maxRetries = 2, // Total 3 attempts (1 initial + 2 retries)
  delayMs = 1000
): Promise<T> => {
  let attempt = 0;
  while (attempt <= maxRetries) {
    try {
      return await apiCall();
    } catch (error: any) {
      attempt++;
      const isLastAttempt = attempt > maxRetries;
      let isRetryable = false;

      // Check error structure for retryable conditions (typically 5xx server errors or network issues)
      if (error && error.error && typeof error.error.code === 'number' && error.error.code >= 500 && error.error.code < 600) {
        isRetryable = true; // Typically a server-side issue that might be transient
      } else if (error && typeof error.message === 'string' && (error.message.toLowerCase().includes('xhr error') || error.message.toLowerCase().includes('network error'))) {
        isRetryable = true; // Generic network-related error
      }
      
      console.error(`API call attempt ${attempt -1} failed:`, error);

      if (isRetryable && !isLastAttempt) {
        const currentDelay = delayMs * Math.pow(2, attempt - 1); // Exponential backoff
        console.warn(`Retrying API call in ${currentDelay}ms... (${maxRetries - attempt + 1} retries left)`);
        await new Promise(resolve => setTimeout(resolve, currentDelay));
      } else {
        throw error; // Re-throw if not retryable or no retries left
      }
    }
  }
  throw new Error("API call failed after multiple retries."); // Should not be reached if error is always re-thrown
};


export const getEmailSentiment = async (emailContent: string): Promise<Sentiment> => {
  if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY") return Sentiment.Unknown;
  
  const apiCall = () => ai.models.generateContent({
    model: GEMINI_MODEL_TEXT,
    contents: `Analyze the sentiment of the following email content. Respond with only one of these words: Positive, Negative, Neutral, Mixed.\n\nEmail content: "${emailContent}"`,
  });

  try {
    const response = await makeApiCallWithRetry(apiCall);
    const textResponse = response.text.trim();
    if (Object.values(Sentiment).includes(textResponse as Sentiment)) {
      return textResponse as Sentiment;
    }
    console.warn(`Unexpected sentiment response: ${textResponse}`);
    return Sentiment.Unknown;
  } catch (error) {
    // Error already logged by makeApiCallWithRetry, additional context specific log:
    console.error("Error getting email sentiment after final retry attempt:", error);
    throw error;
  }
};

export const getSmartReplies = async (emailContent: string, context?: string): Promise<string[]> => {
  if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY") return ["Could not generate replies (API key missing)."];
  
  const apiCall = () => ai.models.generateContent({
      model: GEMINI_MODEL_TEXT,
      contents: `Given the email content${context ? ` and context ("${context}")` : ''}, suggest 3 concise smart replies. Each reply should be one short sentence. Return the replies as a JSON array of strings. For example: ["Got it, thanks!", "Will look into this.", "Sounds good."]\n\nEmail content: "${emailContent}"`,
      config: {
        responseMimeType: "application/json",
      }
  });

  try {
    const response = await makeApiCallWithRetry(apiCall);
    const parsedReplies = parseJsonFromMarkdown<string[]>(response.text);

    if (Array.isArray(parsedReplies) && parsedReplies.every(r => typeof r === 'string')) {
        return parsedReplies.slice(0, 3);
    }
    console.warn("Unexpected smart replies format:", response.text);
    const lines = response.text.split('\n').map(line => line.trim().replace(/^- /, '')).filter(Boolean);
    if (lines.length > 0) return lines.slice(0,3);

    return ["Could not generate suitable replies."];
  } catch (error) {
    console.error("Error getting smart replies after final retry attempt:", error);
    throw error;
  }
};

export const summarizeEmail = async (emailContent: string): Promise<string> => {
  if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY") return "Summary unavailable (API key missing).";

  const apiCall = () => ai.models.generateContent({
    model: GEMINI_MODEL_TEXT,
    contents: `Summarize the following email content in one or two short sentences:\n\nEmail content: "${emailContent}"`,
  });
  
  try {
    const response = await makeApiCallWithRetry(apiCall);
    return response.text.trim();
  } catch (error) {
    console.error("Error summarizing email after final retry attempt:", error);
    throw error;
  }
};

export const getInfoWithSearch = async (query: string): Promise<{ text: string; sources: any[] }> => {
  if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY") return { text: "Search unavailable (API key missing).", sources: [] };
  
  const apiCall = () => ai.models.generateContent({
    model: GEMINI_MODEL_TEXT,
    contents: query,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  try {
    const response = await makeApiCallWithRetry(apiCall);
    const text = response.text;
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    return { text, sources };
  } catch (error) {
    console.error("Error with grounded generation after final retry attempt:", error);
    throw error;
  }
};
