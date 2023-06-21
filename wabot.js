const qrcode = require("qrcode-terminal");
const fs = require("fs");
const {
  Client,
  LegacySessionAuth,
  LocalAuth,
  MessageMedia,
} = require("whatsapp-web.js");
const client = new Client({
  authStrategy: new LocalAuth({
    clientId: "client-one", //Un identificador(Sugiero que no lo modifiques)
  }),
});

// Save session values to the file upon successful auth
client.on("authenticated", (session) => {
  console.log(session);
});

client.initialize();
client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("ready to message");
});
//bot halo
client.on("message", (message) => {
  if (message.body === "Halo") {
    message.reply(
      "apa kabar\n Saya Bot Kevin Ada yang bisa di bantu?\nKETIK menu JIKA ADA PERTANYAAN"
    );
  }
});
//bot menu
client.on("message", (message) => {
  if (message.body === "menu") {
    message.reply("/ask untuk bertanya\n/draw untuk gambar");
  }
});
