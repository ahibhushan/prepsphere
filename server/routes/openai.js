import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();
const app = express.Router();
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// const generateQuestionsContext = `
// Your role is to generate an interview question for a candidate doing an interview.
// For context, the candidate is applying for the position *insert_title_here* at the company *insert_company_here*. The type of positions they are applying for
// are the following: *insert_type_here*. The requirements for this job are the following: "*insert_reqs_here*".
// The questions the candidate is already being asked is provided in an array here: *insert_questions_here*
// Make sure that the question you generate is not a repeat of any of the questions that are already being asked.
// Please limit the question to one sentence. The question should be directed to the candidate in second person. Your response should be in the format of a string.
// `;

const generateQuestionsContext = `
Your role is to generate an interview question for a candidate doing an interview. 
For context, the candidate is applying for the position *insert_title_here* at the company *insert_company_here*. The type of positions they are applying for 
are the following: *insert_type_here*. The requirements for this job are the following: "*insert_reqs_here*".
The questions the candidate is already being asked is provided in an array here: *insert_questions_here*
Make sure that the question you generate is not a repeat of any of the questions that are already being asked.
Please limit the question to one sentence and make question a lot more technical. The question should be directed to the candidate in the second person. Your response should be in the form of a valid string without double quotes.
`;

app.post("/generateQuestion", async (req, res) => {
  const { title, type, company, reqs, questions } = req.body;

  const systemContext = generateQuestionsContext
    .replace("*insert_title_here*", title)
    .replace("*insert_type_here*", type.join(", "))
    .replace("*insert_company_here*", company)
    .replace("*insert_reqs_here*", reqs)
    .replace("*insert_questions_here*", questions); // Assuming no existing questions are passed for simplicity

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "system", content: systemContext }],
      max_tokens: 500,
    });

    const completion = response.choices[0].message.content;
    console.log(completion);
    res.json({ completion }); // Sending the formatted response back to the client
  } catch (error) {
    console.error("Error in generating questions:", error);
    res.status(500).json({
      error: "Failed to generate questions due to internal server error",
    });
  }
});

//tts api currently not working

// app.post("/textToSpeech", async (req, res) => {
//   try {
//     const { text } = req.body;
//     const mp3 = await openai.audio.speech.create({
//       model: "tts-1",
//       voice: "nova",
//       input: text,
//     });
//     const audioData = await mp3.arrayBuffer();

//     res.setHeader("Content-Type", "audio/mpeg");
//     res.send(audioData);
//   } catch (error) {
//     console.error("Error in POST /textToSpeech:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });



export { app as UserApp };
