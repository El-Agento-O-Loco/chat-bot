/**
 * API Service - Handles communication with the backend AI server
 */

const API_BASE_URL = 'https://cfzdnad2mv.eu-west-1.awsapprunner.com/';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Call the chat completion endpoint
 */
export async function chatCompletion(
  messages: ChatMessage[],
  model: string = 'claude-sonnet-4.5'
): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data: ChatCompletionResponse = await response.json();
    return data.choices[0]?.message?.content || 'No response from AI';
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

/**
 * Check if API is available
 */
export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/v1/models`, {
      method: 'GET',
    });
    return response.ok;
  } catch (error) {
    console.error('API Health Check Failed:', error);
    return false;
  }
}
