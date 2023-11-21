const request = require("request");
const express = require("express");
const app = express();

app.use(express.json());

// POST /aircall/calls
app.post("/aircall/calls", (req, res) => {
  if (req.body.event === "call.created") {
    // console.log("Call.created", req.body);
    const callId = req.body.data.id;
    const cardContent = getInsightCardContent();

    const payload = createInsightCardPayload(cardContent);
    // console.log("payload", payload);

    sendInsightCard(callId, payload);
  } else {
    console.log("Event non-handled:", req.body.event);
  }
//   console.log("/aircall/calls");

  res.sendStatus(200);
});
app.get("/aircall/calls", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello, this server is running on GoDaddy!");
//   console.log("working");
});

const sendInsightCard = (callId, payload) => {
  const API_ID = "a6caaf06ff64165cd43ae294e2198ea0";
  const API_TOKEN = "6b8934a7422353ebae48e818912136d2";

  const uri = `https://${API_ID}:${API_TOKEN}@api.aircall.io/v1/calls/${callId}/insight_cards`;

  request.post(uri, { json: payload }, (error, response, body) => {
    if (!!error) {
      console.error("Error while sending insight card:", error);
    } else {
      console.log("HTTP status code:", response && response.statusCode);
      console.log("HTTP body:", body);
    }
  });
};

const getInsightCardContent = () => {
  let lines = [];

  // Write your business logic here to populate the lines of the card
  lines.push("Dean Titlow");
  // lines.push('+61 283109201');
  // lines.push('last notes');
  return lines;
};

const createInsightCardPayload = (lines) => {
  let payload = {
    contents: [],
  };
  lines.forEach((line, index) => {
    payload.contents.push(
      {
        type: "title",
        text: line,
        link: "https://my-custom-crm.com/12345",
      },
      {
        type: "shortText",
        text: "xyz company",
        label: "Company Name",
      },
      {
        type: "shortText",
        text: "+61 283109201",
        label: "Phone No.",
      },
      {
        type: "shortText",
        text: "Need Help from you",
        label: "Last Note",
      }
    );
  });
  return payload;
};

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
