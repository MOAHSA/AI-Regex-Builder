import { GoogleGenAI } from "@google/genai";

// FIX: Initialize GoogleGenAI directly with process.env.API_KEY as per guidelines, assuming it is set in the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateRegex = async (description: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an expert in regular expressions. Based on the following description, generate ONLY the regular expression pattern. Do not include any explanations, comments, or enclosing characters like \` or /.
Description: "${description}"`,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error generating regex:", error);
    return "Error: Could not generate regex.";
  }
};

export const explainRegex = async (regex: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an expert in regular expressions. Explain the following regular expression in simple terms. Break it down part by part. Provide the explanation in Markdown format.
Regular Expression: \`${regex}\``,
    });
    return response.text;
  } catch (error) {
    console.error("Error explaining regex:", error);
    return "Error: Could not explain regex.";
  }
};

export const generateTestString = async (regex: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `You are a helpful assistant that creates test data for regular expressions. Based on the following regex, generate a single block of text to be used as a test string. The text should be creative and include multiple examples that WILL match the regex and some examples that WILL NOT match it, to ensure comprehensive testing. Do not provide any explanation, just the text block.
Regex: \`${regex}\``,
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error generating test string:", error);
        return "Error: Could not generate a test string.";
    }
};
