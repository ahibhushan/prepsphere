import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const firstMessageContext =
  "You are an interviewer interviewing a candidate for the role of a *insert_job_here* at your company *insert_company_here*. The candidate's name is *insert_name_here*. Speak only from the perspective of the interviewer. Do not include the time of day. Welcome the candidate to the interview and ask them the first question of: ";

const subsequentMessageContext =
  "You are an interviewer interviewing a candidate for the role of a *insert_job_here* at your company *insert_company_here*. The candidate's name is *insert_name_here*. Briefly acknowledge their previous answer and then ask them the next question of: ";

const lastMessageContext =
  "You are an interviewer interviewing a candidate for the role of a *insert_job_here* at your company *insert_company_here*. The candidate's name is *insert_name_here*. Briefly respond to their last answer and thank them for joining you for the interview.";

const feedbackContext = `
Your role is to give feedback to a candidate who just did an interview. The question they were asked by the interviewer is "*insert_question_here*". 
  The candidate's answer to this question is "*insert_answer_here*". 
  For context, the candidate is applying for the position *insert_title_here* at the company *insert_company_here*. The type of positions they are applying for 
  are the following: *insert_type_here*. The requirements for this job are the following: "*insert_reqs_here*". 
  Please limit the feedback to 200 words and do not repeat the question or the answer. You are speaking to the candidate in second person. 
  Please organize your answer into two sections: "strengths" and "improvements", where the "strengths" section talks about what the candidate did well and 
  the "improvements" section talks about areas of improvement for the candidate's answer. For each section, add a heading that highlights each point made. 
  The response should be in a JSON format like the following

{
"strengths": {
    "feedback_heading_1": "feedback_1",
    "feedback_heading_2": "feedback_2"
}, "improvements": {
   "feedback_heading_1": "feedback_1",
    "feedback_heading_2": "feedback_2",
    "feedback_heading_3": "feedback_3"
}
}

where feedback_heading_* is replaced by the heading that the category of the feedback you have, and feedback_* is replaced by the content of the feedback. The "strengths" and "improvements" sections can have anywhere between one to five feedback points. 

Here is an example:

{
"strengths": {
    "Personalized answers": "Good job in making the company personal to you by providing examples!",
    "Adding your impact": "It's great to always say what impact you had in the previous companies you worked at. What you said was great!"
}, "improvements": {
   "Be more specific" : "Add more details in your answers by recounting a specific scenario or example that you remember from the past. This will make your answer more authentic"
}
}
`;

const overallFeedbackContext = `
Your role is to give overall feedback to a candidate who just did an interview.
For context, the candidate is applying for the position *insert_title_here* at the company *insert_company_here*. The type of positions they are applying for 
are the following: *insert_type_here*. The requirements for this job are the following: "*insert_reqs_here*".
The questions of the interviewer and the answers by the candidate are in an array of objects provided below, where each object in the array represents one question/answer pair.
The question field in each object is the question asked by the interviewer and the answer field in each object is the candidate's answer to that respective question.
Here is the array of objects:
*insert_questions_here*

Please limit the feedback to 150 words and do not repeat the question or the answer. You are speaking to the candidate in second person. Your answer should be in the format of 
a string.
`;

const generateQuestionsContext = `
Your role is to generate an interview question for a candidate doing an interview. 
For context, the candidate is applying for the position *insert_title_here* at the company *insert_company_here*. The type of positions they are applying for 
are the following: *insert_type_here*. The requirements for this job are the following: "*insert_reqs_here*".
The questions the candidate is already being asked is provided in an array here: *insert_questions_here*
Make sure that the question you generate is not a repeat of any of the questions that are already being asked.
Please limit the question to one sentence. The question should be directed to the candidate in second person. Your answer should be in the format of a string.
`;

export async function POST(request) {
  const body = await request.json();
  const queryType = body.prompt.queryType;

  let context = [];

  if (queryType == 'firstMessage') {
    const jobTitle = body.prompt.jobTitle;
    const jobCompany = body.prompt.jobCompany;
    const questionToAsk = body.prompt.question;
    const name = body.prompt.name;

    const systemContext = firstMessageContext
      .replace('*insert_company_here*', jobCompany)
      .replace('*insert_job_here*', jobTitle)
      .replace('*insert_name_here*', name)
      .concat(questionToAsk);

    context.push({
      role: 'system',
      content: systemContext,
    });
  } else if (queryType == 'subsequentMessage') {
    const jobTitle = body.prompt.jobTitle;
    const jobCompany = body.prompt.jobCompany;
    const prevQuestion = body.prompt.prevQuestion;
    const prevAnswer = body.prompt.prevAnswer;
    const questionToAsk = body.prompt.question;
    const name = body.prompt.name;

    const systemContext = subsequentMessageContext
      .replace('*insert_job_here*', jobTitle)
      .replace('*insert_company_here*', jobCompany)
      .replace('*insert_name_here*', name)
      .concat(questionToAsk);

    context.push({
      role: 'system',
      content: systemContext,
    });

    context.push({
      role: 'assistant',
      content: prevQuestion,
    });

    context.push({
      role: 'user',
      content: prevAnswer,
    });
  } else if (queryType == 'lastMessage') {
    const jobTitle = body.prompt.jobTitle;
    const jobCompany = body.prompt.jobCompany;
    const prevQuestion = body.prompt.prevQuestion;
    const prevAnswer = body.prompt.prevAnswer;
    const name = body.prompt.name;

    const systemContext = lastMessageContext
      .replace('*insert_job_here*', jobTitle)
      .replace('*insert_company_here*', jobCompany)
      .replace('*insert_name_here*', name);

    context.push({
      role: 'system',
      content: systemContext,
    });

    context.push({
      role: 'assistant',
      content: prevQuestion,
    });

    context.push({
      role: 'user',
      content: prevAnswer,
    });
  } else if (queryType == 'feedback') {
    const question = body.prompt.question;
    const answer = body.prompt.answer;
    const jobTitle = body.prompt.title;
    const jobType = body.prompt.type;
    const jobCompany = body.prompt.company;
    const jobReqs = body.prompt.reqs;

    const systemContext = feedbackContext
      .replace('*insert_question_here*', question)
      .replace('*insert_answer_here*', answer)
      .replace('*insert_title_here*', jobTitle)
      .replace('*insert_type_here*', jobType.join(', '))
      .replace('*insert_company_here*', jobCompany)
      .replace('*insert_reqs_here*', jobReqs);

    context.push({
      role: 'system',
      content: systemContext,
    });

  } else if (queryType == 'overall') {
    const questions = body.prompt.questions;
    const jobTitle = body.prompt.title;
    const jobType = body.prompt.type;
    const jobCompany = body.prompt.company;
    const jobReqs = body.prompt.reqs;

    const systemContext = overallFeedbackContext
      .replace('*insert_questions_here*', questions)
      .replace('*insert_title_here*', jobTitle)
      .replace('*insert_type_here*', jobType.join(', '))
      .replace('*insert_company_here*', jobCompany)
      .replace('*insert_reqs_here*', jobReqs);

    context.push({
      role: 'system',
      content: systemContext,
    });
  } else if (queryType == 'generateQuestion') {
    const questions = body.prompt.questions;
    const jobTitle = body.prompt.title;
    const jobType = body.prompt.type;
    const jobCompany = body.prompt.company;
    const jobReqs = body.prompt.reqs;

    const systemContext = generateQuestionsContext
      .replace('*insert_questions_here*', questions)
      .replace('*insert_title_here*', jobTitle)
      .replace('*insert_type_here*', jobType.join(', '))
      .replace('*insert_company_here*', jobCompany)
      .replace('*insert_reqs_here*', jobReqs);

    context.push({ role: 'system', content: systemContext });
  }

  const completion = await openai.chat.completions.create({
    messages: context,
    model: 'gpt-3.5-turbo',
    stream: true,
  });

  
 const stream = OpenAIStream(completion);

  return new StreamingTextResponse(stream);
}
{
  "0": "{\n  \"strengths\": [\n    {\n      \"feedbackHeading\": \"Clear and concise\",\n      \"feedback\": \"Your response was clear and to the point, which is important in an interview setting.\"\n    },\n    {\n      \"feedbackHeading\": \"Confidence\",\n      \"feedback\": \"You delivered your answer confidently, showing a strong presence during the interview.\"\n    }\n  ],\n  \"improvements\": [\n    {\n      \"feedbackHeading\": \"Provide relevant examples\",\n      \"feedback\": \"It would be beneficial to include specific examples or experiences to support your answers and showcase your skills.\"\n    },\n    {\n      \"feedbackHeading\": \"Engage with the question\",\n      \"feedback\": \"Try to engage more with the question asked and provide a more detailed response to demonstrate your knowledge and expertise.\"\n    },\n    {\n      \"feedbackHeading\": \"Show enthusiasm\",\n      \"feedback\": \"Show more enthusiasm and passion in your responses to make a memorable impression on the interviewer.\"\n    }\n  ]\n}",
  "1": "{\n  \"strengths\": [\n    {\n      \"feedbackHeading\": \"Engagement\",\n      \"feedback\": \"You remained engaged and focused during the interview, which is great for demonstrating your interest in the position.\"\n    },\n    {\n      \"feedbackHeading\": \"Confidence\",\n      \"feedback\": \"You delivered your response confidently, showcasing your ability to communicate effectively.\"\n    }\n  ],\n  \"improvements\": [\n    {\n      \"feedbackHeading\": \"Content\",\n      \"feedback\": \"It's important to provide a complete answer, make sure to include relevant information or examples to support your response.\"\n    },\n    {\n      \"feedbackHeading\": \"Clarity\",\n      \"feedback\": \"Try to be more clear and concise in your responses, avoiding gaps or confusion that may arise from incomplete answers.\"\n    },\n    {\n      \"feedbackHeading\": \"Preparation\",\n      \"feedback\": \"Ensure you are adequately prepared for all types of questions that may come up in the interview, this will help you provide more detailed and comprehensive answers.\"\n    }\n  ]\n}",
  "2": "{\n  \"strengths\": [\n    {\n      \"feedbackHeading\": \"Clarity of expression\",\n      \"feedback\": \"Your response was clear and concise, which is important in interviews.\"\n    },\n    {\n      \"feedbackHeading\": \"Confidence in delivery\",\n      \"feedback\": \"You seemed confident while delivering your answer, which is a great quality.\"\n    }\n  ],\n  \"improvements\": [\n    {\n      \"feedbackHeading\": \"Lack of content\",\n      \"feedback\": \"Your answer lacked substance and did not provide any information or insights that could showcase your skills and qualifications.\"\n    },\n    {\n      \"feedbackHeading\": \"Missing examples\",\n      \"feedback\": \"It would be beneficial to include examples or experiences to support your response and make it more compelling.\"\n    },\n    {\n      \"feedbackHeading\": \"Relevance to the job\",\n      \"feedback\": \"Make sure your response directly addresses the requirements of the job you are applying for, as this was missing in your answer.\"\n    }\n  ]\n}"
}