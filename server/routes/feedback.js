import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();
const app = express.Router();
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const feedbackContext = `
Your role is to give feedback to a candidate who just did an interview. The question they were asked by the interviewer is "*insert_question_here*". 
  The candidate's answer to this question is "*insert_answer_here*". 
  Don't mention or repeat the question or answer in your response. Never mention question or answer as undefined in your response. 
  For context, the candidate is applying for the position *insert_title_here* at the company *insert_company_here*. The type of positions they are applying for 
  are the following: *insert_type_here*. The requirements for this job are the following: "*insert_reqs_here*". 
  Please limit the feedback to 200 words and do not repeat the question or the answer. You are speaking to the candidate in the second person. 
  Please organize your answer into two sections: "strengths" and "improvements", where the "strengths" section talks about what the candidate did well and 
  the "improvements" section talks about areas of improvement for the candidate's answer. For each section, add a heading that highlights each point made. 
  The response should be in a Array format like the following
    Note:**If the answer is empty or irrevalant return empty string**
[
  "strengths": [
    {
      "feedbackHeading": "feedback_heading_1",
      "feedback": "feedback_1"
    },
    {
      "feedbackHeading": "feedback_heading_2",
      "feedback": "feedback_2"
    }
  ],
  "improvements": [
    {
      "feedbackHeading": "feedback_heading_1",
      "feedback": "feedback_1"
    },
    {
      "feedbackHeading": "feedback_heading_2",
      "feedback": "feedback_2"
    },
  ]
}
]

where feedback_heading_* is replaced by the heading that the category of the feedback you have, and feedback_* is replaced by the content of the feedback. The "strengths" and "improvements" sections can have anywhere between three to five feedback points. 

Here is an example:

[]
  "strengths": [
    {
      "feedbackHeading": "Personalized answers",
      "feedback": "Good job in making the company personal to you by providing examples!"
    },
    {
      "feedbackHeading": "Adding your impact",
      "feedback": "It's great to always say what impact you had in the previous companies you worked at. What you said was great!"
    }
  ],
  "improvements": [
    {
      "feedbackHeading": "Be more specific",
      "feedback": "Add more details in your answers by recounting a specific scenario or example that you remember from the past. This will make your answer more authentic"
    }
  ]
]
`;

const overallFeedbackContext = `
Your role is to give overall feedback to a candidate who just did an interview.
For context, the candidate is applying for the position *insert_title_here* at the company *insert_company_here*. The type of positions they are applying for 
are the following: *insert_type_here*. The requirements for this job are the following: "*insert_reqs_here*".
The questions of the interviewer and the answers by the candidate are in an array of objects provided below, where each object in the array represents one question/answer pair.
The question field in each object is the question asked by the interviewer and the answer field in each object is the candidate's answer to that respective question.
Here is the array of objects:
*insert_questions_here*

Please limit the feedback to 150 words, the feedback should be in form of 6 distinct feedback separated with "." and do not repeat the question or the answer. You are speaking to the candidate in second person. Your answer should be in the format of 
a JSON with key named feedback.
`;

app.post("/generateFeedback", async (req, res) => {
  const { question, answer, title, type, company, reqs } = req.body;
  //   const question = questions[0].question;
  //   const answer = questions[0].answer;

  const systemContext = feedbackContext
    .replace("*insert_question_here*", question ?? "null")
    .replace("*insert_answer_here*", answer ?? "null")
    .replace("*insert_title_here*", title ?? "null")
    .replace("*insert_type_here*", type.join(", ") ?? "null")
    .replace("*insert_company_here*", company ?? "null")
    .replace("*insert_reqs_here*", reqs ?? "null");

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "system", content: systemContext }],
      max_tokens: 600,
    });

    const completion = response.choices[0].message.content;
    console.log(completion);
    res.json({ completion });
  } catch (error) {
    console.log(error);
  }
});

export { app as UserFeedback };
