import express from "express";
import crypto from "crypto";
import { Client as HubSpot } from "@hubspot/api-client";

const app = express();
const PORT = process.env.PORT || 3000;
const TALLY_SIGNING_SECRET = process.env.TALLY_SIGNING_SECRET || "";
const HUBSPOT_ACCESS_TOKEN = process.env.HUBSPOT_ACCESS_TOKEN || "";

const hubspot = new HubSpot({ accessToken: HUBSPOT_ACCESS_TOKEN });

app.post("/tally/webhook", (req, res) => {
  const secret = req.query.secret;
  if (secret !== TALLY_SIGNING_SECRET) {
    return res.status(403).send("Forbidden");
  }
  const name = submission.data.fields.find((f) => f.label === "Name")?.value;
  const email = submission.data.fields.find((f) => f.label === "Email")?.value;
});
