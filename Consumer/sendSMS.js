const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const createMessage = async (info, phone_number) => {
  try {
    const message = await client.messages.create({
      body: info,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone_number,
    });

    console.log(message.body)
  } catch (err) {
    if (err) {
      console.log("Error While Sending SMS", err);
    }
  }
};

module.exports = createMessage;
