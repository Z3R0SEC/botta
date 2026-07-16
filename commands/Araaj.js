const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'ai',
  description: 'Chat with Mota AI',
  usage: 'ai <message>',
  author: 'Mota - Dev',

  async execute(senderId, args, pageAccessToken, user, attachment = null) {

    const prompt = args.join(' ').trim();

    const syst = `
      You are Mvest, the official AI assistant for Standby Clothing. Your goal is to be exceptionally friendly, welcoming, and helpful to customers. Keep your responses concise (1–3 sentences), natural, and conversational. Always include 1–2 relevant emojis to keep the vibe upbeat and human. 

CRITICAL FORMATTING RULE: Never use Markdown links like [text](url). When sharing a website, simply write out the plain URL (e.g., https://standbyclothing.xyz) so it displays cleanly in chat apps.

Follow these strict guidelines based on user inquiries:
- General Welcome/Vibe: Be warm, polite, and enthusiastic! 
- Products/Catalog/Pricing: Enthusiastically direct them to the website. (e.g., "You can check out our latest collections, pricing, and availability right on our website! Head over to https://standbyclothing.xyz to browse. 🛍️")
- About the Brand: "Standby Clothing is an independent fashion hub established in 2021 by Njabulo Hlatshwayo, focusing on curated branded streetwear! 🧢"
- Contact Info: "You can reach us via WhatsApp or Call at +27834493272, or email us at contact@standbyclothing.xyz! 📞"
- Website/AI Development: "Our digital platforms were designed, developed, and maintained by Motadev (+27847611848 / https://motadev.xyz) in collaboration with Standby Clothing! 💻"
      `;
    const id = senderId;
    const token = pageAccessToken;

    const defaultMessages = [
      "Yo, Sup?",
      "Yo, What's the Word?",
      "Need Something?",
      "Listening...",
      "What's New Dude?"
    ];

    const fallback =
      defaultMessages[Math.floor(Math.random() * defaultMessages.length)];

    if (attachment) {

      let type = attachment.type || "file";

      return sendMessage(id, {
        text:
`Our system detected that youve sent Attachment type ${type} Unfortunately We No longer have support for image viewing. Please Dare to check out our official website to check related products or place and track orders\n\nhttps://standbyclothing.xyz\n\nWhatsapp: +27834493272 .
Try sending me a plain message or ask me any question`
      }, token);
    }
    if (!prompt) {
      return sendMessage(id, {
        text: fallback
      }, token);
    }

    const apiUrl = 'https://api.motadev.xyz/api/chat';

    try {

      const response = await axios.post(
        apiUrl,
        {
          user_id: id,

          messages: {
            system: syst,
            user: prompt
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',

            'User-Agent':
              'motadev-ai/3.0 (platform=messenger; type=bot)',

            'X-API-KEY':
              "mtd_key3656390874YRAU",

            'Referer':
              'https://standbyclothing.xyz'
          },

          timeout: 30000
        }
      );

      const res = response.data;

      if (res.success) {

        let reply =
          res.reply ||
          res.message ||
          res.response ||
          "No response received.";

        await sendMessage(id, {
          text: reply
        }, token);

      } else {
          console.log("Error occured!!!");
         }

    } catch (error) {

      console.error(
        'AI System Offline!\nPlease consider contacting us via WhatsApp at +27834493272 or simply visit our official website to place your order at https://standbyclothing.xyz.\n\n(For Development purpose Please ignore the following message)\n\n',
        error.response?.data || error.message
      );

      let errMsg =
        error.response?.data?.message ||
        error.message ||
        "Unknown Error";

    }

  }
};
