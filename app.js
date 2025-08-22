import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

// HubSpot Private App Token
const HUBSPOT_TOKEN = process.env.HUBSPOT_API_KEY;

// Tally webhook endpoint
app.post("/tally-webhook", async (req, res) => {
  try {
    console.log("Tally Webhook Data:", req.body);

    const { fields } = req.body.data;

    const name = fields.Name || "";
    const email = fields.Email || "";
    const phone = fields.Phone || "";

    const response = await axios.post(
      "https://api.hubapi.com/crm/v3/objects/contacts",
      {
        properties: {
          email: email,
          firstname: name,
          phone: phone,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${HUBSPOT_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("HubSpot Response:", response.data);

    res.sendStatus(200);
  } catch (err) {
    console.error(
      "❌ Error sending to HubSpot:",
      err.response?.data || err.message
    );
    res.sendStatus(500);
  }
});

app.listen(3000, () => {
  console.log("✅ Server running on http://localhost:3000");
});
