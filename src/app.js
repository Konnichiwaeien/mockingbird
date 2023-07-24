import config from 'config';
import { Telegraf, session } from 'telegraf';
import { message } from 'telegraf/filters';
import { code } from 'telegraf/format';
import { OggConverter } from './OggConverter.js';
import { OpenAI } from './OpenAI.js';

const userSession = {
  messages: []
};

const bot = new Telegraf(config.get('TELEGRAM_TOKEN'));
const openai = new OpenAI(config.get('OPENAI_API_KEY'));

bot.use(session());

bot.command('new', async (ctx) => {
  ctx.session = userSession;
  await ctx.reply('New session created');
  await ctx.reply('Waiting for your text or voice request');
});

bot.command('start', async (ctx) => {
  ctx.session = userSession;
  await ctx.reply('👍');
  await ctx.reply('I am here for you now my dude, ask me something weirdo broooo');
});

bot.on(message('text'), async (ctx) => {
  ctx.session ??= userSession;

  try {
    const userID = String(ctx.message.from.id);
    await ctx.reply(code('Your text message accepted. Wait for the answer'));
    await ctx.reply(code(`Your request is: ${ctx.message.text}`));

    ctx.session.messages.push({"role": "user", "content": ctx.message.text});
    const chatAnswer = await openai.chat(ctx.session.messages);
    ctx.session.messages.push({"role": "assistant", "content": chatAnswer.content})

    ctx.reply(chatAnswer.content);
  } catch (error) {
    console.log('Voice error');
  }
});

bot.on(message('voice'), async (ctx) => {
  ctx.session ??= userSession;

  try {
    await ctx.reply(code('Your voice message accepted. Wait for the answer'));
    const link = await ctx.telegram.getFileLink(ctx.message.voice.file_id);
    const userID = String(ctx.message.from.id);
    const converter = new OggConverter();
    const oggPath = await converter.create(link.href, userID);
    const mp3Path = await converter.convertToMp3(oggPath, userID);
    const transcriptedText = await openai.transcription(mp3Path);
    await ctx.reply(code(`Your request is: ${transcriptedText.text}`));

    ctx.session.messages.push({"role": "user", "content": transcriptedText.text});
    const chatAnswer = await openai.chat(ctx.session.messages);
    ctx.session.messages.push({"role": "assistant", "content": chatAnswer.content})

    ctx.reply(chatAnswer.content);
  } catch (error) {
    console.log('Voice error');
  }
});

bot.launch();