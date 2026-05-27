require('dotenv').config();
const { App } = require('@slack/bolt');

const MAP = {
  'shh':'щ','sh':'ш','zh':'ж','ch':'ч','ts':'ц','ya':'я','yu':'ю','yo':'ё',
  'a':'а','b':'б','v':'в','g':'г','d':'д','e':'е','z':'з','i':'и',
  'j':'й','k':'к','l':'л','m':'м','n':'н','o':'о','p':'п','r':'р',
  's':'с','t':'т','u':'у','f':'ф','h':'х','y':'ы','x':'кс',
  'A':'А','B':'Б','V':'В','G':'Г','D':'Д','E':'Е','Z':'З','I':'И',
  'J':'Й','K':'К','L':'Л','M':'М','N':'Н','O':'О','P':'П','R':'Р',
  'S':'С','T':'Т','U':'У','F':'Ф','H':'Х','Y':'Ы'
};

function latinToCyrillic(text) {
  let result = '', i = 0;
  while (i < text.length) {
    if (MAP[text.slice(i, i+3)])      { result += MAP[text.slice(i, i+3)]; i += 3; }
    else if (MAP[text.slice(i, i+2)]) { result += MAP[text.slice(i, i+2)]; i += 2; }
    else if (MAP[text[i]])            { result += MAP[text[i]]; i++; }
    else                              { result += text[i]; i++; }
  }
  return result;
}

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
});

// Префікс "!" — бот відповідає в тред
app.message(/^!/, async ({ message, say }) => {
  const converted = latinToCyrillic(message.text.slice(1).trim());
  await say({ text: converted, thread_ts: message.ts });
});

// Slash команда /cyr
app.command('/cyr', async ({ command, ack, say }) => {
  await ack();
  await say(`*${command.user_name}:* ${latinToCyrillic(command.text)}`);
});

(async () => {
  await app.start();
  console.log('✅ CyrBot запущено!');
})();
