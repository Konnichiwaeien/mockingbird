import { createReadStream } from 'fs';
import { Configuration, OpenAIApi } from 'openai';

export class OpenAI {
  constructor(apiKey) {
    const configuration = new Configuration({
      apiKey,
    });
    this.openai = new OpenAIApi(configuration);
    this.roles = {
      assistant: 'assistant',
      user: 'user',
      system: 'system' 
    };
  };

  chat = async (messages) => {
    try {
      const response = await this.openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages
      });

      return response.data.choices[0].message;
    } catch (error) {
      console.log(error.message, 'Chat gpt error');
    }
  };

  transcription = async (file) => {
    try {
      const response = await this.openai.createTranscription(createReadStream(file), 'whisper-1');
      return response.data;
    } catch (error) {
      console.log(error.message, 'Request to transcription error');
    }
  };
};