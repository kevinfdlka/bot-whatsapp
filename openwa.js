const qrcode = require("qrcode-terminal");
const fs = require("fs");
const figlet = require("figlet");
const chalk = require("chalk");
const {
  Client,
  LegacySessionAuth,
  LocalAuth,
  MessageMedia,
} = require("whatsapp-web.js");
const { getSystemErrorMap } = require("util");
const { Configuration, OpenAIApi } = require("openai");
const { url } = require("inspector");
const configuration = new Configuration({
  apiKey: "#",//use secret key on open ai 
});
const openai = new OpenAIApi(configuration);
const client = new Client({
  authStrategy: new LocalAuth({
    clientId: "client-one", 
  }),
});

// TERMINAL
client.on("authenticated", (session) => {
  console.log(session);
});

client.initialize();
client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
  console.log("Scan kode QR ini menggunakan WhatsApp Anda untuk masuk");
});
//TERMINAL ASCII
client.on("ready", () => {
  figlet.text(
    "KevinFdlka",
    {
      font: "Standard",
      horizontalLayout: "default",
      verticalLayout: "default",
    },
    function (err, data) {
      if (err) {
        console.log("Error:", err);
        return;
      }
      console.log(chalk.red(data));
      console.log(chalk.green("Kevin Siap"));
    }
  );
});
//MENU
client.on("message", (message) => {
  if (message.body === "Halo") {
    message.reply(
      "Halo! Apa kabar?\nSaya Bot Kevin, ada yang bisa saya bantu?\nKetik 'menu' untuk melihat daftar perintah."
    );
  }
});

client.on("message", (message) => {
  if (message.body === "menu") {
    message.reply(
      "Daftar Perintah:\nAi - Bertanya sesuatu\ngambar - Mengirim gambar"
    );
  }
});
//bot AI
function man() {
  client.on("message", async (message) => {
    if (message.body.includes("Ai")) {
      let text = message.body.split("Ai")[1];
      var qst = `Q: ${text}\nA:`;
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: qst,
        temperature: 0,
        max_tokens: 300,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      });
      message.reply(response.data.choices[0].text);
    } else if (message.body.includes("gambar")) {
      let text = message.body.split("gambar")[1];
      var qst = `Q: ${text}\nA:`;
      const response = await openai.createImage({
        prompt: text,
        n: 1,
        size: "512x512",
      });
      var imgUrl = response.data.data[0].url;
      const media = await MessageMedia.fromUrl(imgUrl);
      await client.sendMessage(message.from, media, {
        caption: "nih gambarnya :)",
      });
    }
  });
}
man();
