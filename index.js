require('dotenv').config();
const { App } = require('@slack/bolt');

async function latinToCyrillic(text) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `Це повідомлення написане латинськими літерами як транслітерація російської мови. 
Перетвори його назад у нормальний російський текст.

Правила:
- Email адреси НЕ перекладай, залишай як є
- Посилання та URL НЕ перекладай, залишай як є
- Назву "Ebitdo" НЕ перекладай, залишай як є
- Поверни ТІЛЬКИ перетворений текст, без пояснень

${text}`
      }]
    })
  });
  const data = await response.json();
  return data.content[0].text;
}

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
});

app.message(/^!/, async ({ message, client }) => {
  const text = message.text.slice(1).trim();
  const converted = await latinToCyrillic(text);

  await client.chat.postMessage({
    channel: message.channel,
    thread_ts: message.ts,
    text: converted,
  });
});

(async () => {
  await app.start();
  console.log('✅ CyrBot запущено!');
})();
