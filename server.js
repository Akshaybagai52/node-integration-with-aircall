const request = require("request");
const express = require("express");
const { default: axios } = require("axios");
const app = express();

app.use(express.json());
let phoneNumber;
// POST /aircall/calls
app.post("/aircall/calls", async (req, res) => {
  if (req.body.event === "call.created") {
    phoneNumber = req.body.data.raw_digits;
    console.log("Call.created", phoneNumber);

    const callId = req.body.data.id;
    const cardContent = getInsightCardContent();

    const payload = await createInsightCardPayload(cardContent);

    try {
      // Make the asynchronous axios request
      // const API_URL = `https://voipy.businessictsydney.com.au/aircall/candidate/${phoneNumber}`;
      // const response = await axios.get(`https://voipy.businessictsydney.com.au/aircall/candidate/${phoneNumber}`);
      // console.log(response.data);

      // Continue with the rest of your code here
      sendInsightCard(callId, payload);
    } catch (error) {
      // Handle the error if the axios request fails
      console.error("Error in axios request:", error);
    }
  } else {
    console.log("Event non-handled:", req.body.event);
  }

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

const createInsightCardPayload = async (lines) => {
  let payload = {
    contents: [],
  };
  const API_URL = `https://voipy.businessictsydney.com.au/aircall/candidate/${phoneNumber}`;
  const response = await axios.get(
    `https://voipy.businessictsydney.com.au/aircall/candidate/${phoneNumber}`
  );
  console.log(response.data);
  lines.forEach((line, index) => {
    payload.contents.push(
      {
        type: "title",
        text: response.data.name || "N/A",
        link: "https://my-custom-crm.com/12345",
      },
      {
        type: "shortText",
        text: response.data.name || "N/A",
        label: "Company Name",
      },
      {
        type: "shortText",
        text: response.data.mobile || "N/A",
        label: "Phone No.",
      },
      {
        type: "shortText",
        text: response.data.notes || "N/A",
        label: "Last Note",
      }
    );
  });
  return payload;
};

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
