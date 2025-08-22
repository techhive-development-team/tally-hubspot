import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

const HUBSPOT_TOKEN = "YOUR_HUBSPOT_PRIVATE_APP_TOKEN";

app.post("/tally-webhook", async (req, res) => {
  try {
    const data = req.body.data; // Tally sends submission here

    // Extract fields (use your Tally field names)
    const email = data.find((f) => f.question === "Email")?.answer;
    const phone = data.find((f) => f.question === "Phone")?.answer;
    const name = data.find((f) => f.question === "Name")?.answer;

    // Send to HubSpot CRM
    await axios.post(
      "https://api.hubapi.com/crm/v3/objects/contacts",
      {
        properties: {
          email: email,
          phone: phone,
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

    res.json({ success: true });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Failed to send to HubSpot" });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
