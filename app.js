import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());

// HubSpot Token from .env
const HUBSPOT_TOKEN = process.env.HUBSPOT_TOKEN;

app.post("/tally-webhook", async (req, res) => {
  try {
    const data = req.body.data;

    const email = data.find(f => f.question === "Email")?.answer;
    const phone = data.find(f => f.question === "Phone")?.answer;
    const name  = data.find(f => f.question === "Name")?.answer;

    // Send to HubSpot
    await axios.post(
      "https://api.hubapi.com/crm/v3/objects/contacts",
      {
        properties: {
          email,
          phone,
          firstname: name,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${HUBSPOT_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ success: true, message: "Contact sent to HubSpot" });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Failed to send to HubSpot" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
