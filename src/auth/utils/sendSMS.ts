import { Vonage } from "@vonage/server-sdk";

const vonage = new Vonage({
  apiKey: "af381996",
  apiSecret: "3mr8Vrrm9F5YxpII",
});

const from = "Vonage APIs";
const to = "972585100114";
const text = "A text message sent using the Vonage SMS API";

const sendSMS = async () => {
  await vonage.sms
    .send({ to, from, text })
    .then((resp) => {
      console.log("Message sent successfully");
      console.log(resp);
    })
    .catch((err) => {
      console.log("There was an error sending the messages.");
      console.error(err);
    });
};

export default sendSMS;
