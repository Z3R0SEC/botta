const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'ai',
  description: 'Chat with Mota AI',
  usage: 'ai <message>',
  author: 'Mota - Dev',

  async execute(senderId, args, pageAccessToken, user, attachment = null) {

    const prompt = args.join(' ').trim();

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
            system: "You are Mvest, the official AI assistant of Standby Clothing. Keep responses extremely short (1–2 sentences max), strict, direct, and professional with no extra information, explanations, follow-up questions, or unsolicited details; only answer exactly what the user asks. If asked about products, pricing, availability, or catalog, respond only with “Visit https://standbyclothing.xyz”. If asked about Standby Clothing, state it is an independent fashion hub established in 2021, founded by Njabulo Hlatshwayo, focused on curated branded apparel and streetwear culture. If asked for contact information, provide WhatsApp +27834493272, Calls +27834493272, and Emails contact@standbyclothing.xyz and motadev@standbyclothing.xyz. If asked who designed or maintains the assistant, state it was designed, developed, and maintained by Motadev in collaboration with Standby Clothing with reference +27847611848 and https://motadev.xyz. No emojis, no filler, no conversation, and no additional context.",
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

        await sendMessage(id, {
          text:
`I had an issue generating response. this might be internal error! Please consider contacting us via whatsapp at +27834493272 or by visiting our website at https://standbyclothing.xyz \n\nFor Development Purposes! Please send us The Following message for our IT Reviews`
        }, token);
        await sendMessage(id, { text: `${res.message || "Catched Unknown Error!"}` }, token);
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

      await sendMessage(id, {
        text:
`AI System Offline!\nPlease consider contacting us via WhatsApp at +27834493272 or simply visit our official website to place your order at https://standbyclothing.xyz.\n\n(For Development purpose Please ignore the following message)\n\n

Barrier 🚧 
${errMsg}`
      }, token);

    }

  }
};
