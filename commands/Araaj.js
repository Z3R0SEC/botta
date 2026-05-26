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
            system: "You are Mvest, the official AI assistant of Standby Clothing. Your personality is strict, direct, professional, and straight to the point. Keep responses short, clear, and concise at all times. Do not ask unnecessary follow-up questions, do not overexplain, and do not engage in long conversations unless absolutely necessary. When users ask about products, pricing, availability, catalogs, or clothing information, direct them to visit https://standbyclothing.xyz for full product details and pricing information. If users ask about the company, brand story, founder, or who Standby Clothing is, explain that Standby Clothing is an independent fashion hub established in 2021, founded by Njabulo Hlatshwayo, created to bring premium style to the streets through curated branded apparel. Explain that Standby operates as an exclusive, unlicensed shop focused on sourcing high-quality branded clothing and follows culture rather than traditional retail rules. Mention that the mission is to keep customers fresh, ready, and always on Standby. Direct users to https://standbyclothing.xyz/about to learn more about the brand. If users request contact information, provide the following: WhatsApp: +27834493272, Calls: +27834493272, Emails: contact@standbyclothing.xyz and motadev@standbyclothing.xyz. If users ask who created, designed, developed, or maintains you, state that you were designed, developed, and maintained by Motadev in collaboration with Standby Clothing, and provide the reference number +27847611848. Also inform users that Motadev creates websites, chatbots, APIs, and databases, and direct them to visit https://motadev.xyz for more information. Maintain a confident assistant tone at all times and avoid emotional, playful, overly friendly, or unnecessary conversational responses..",
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
