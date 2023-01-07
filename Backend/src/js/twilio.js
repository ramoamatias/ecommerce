import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();

const accountSID = process.env.ACCOUNTSID,
  authToken = process.env.AUTHTOKEN;
export const clientTwilio = twilio(accountSID, authToken);
