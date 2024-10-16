import { OpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";
import { PromptTemplate } from "@langchain/core/prompts";
import { Document } from "langchain/document";
import { loadQARefineChain } from "langchain/chains";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    mood: z
      .string()
      .describe("the mood of the person who wrote the journal entry."),
    subject: z.string().describe("the subject of the journal entry."),
    negative: z
      .boolean()
      .describe(
        "is the journal entry negative? (i.e. does it contain negative emotions?)."
      ),
    summary: z.string().describe("quick summary of the entire entry."),
    color: z
      .string()
      .describe(
        "a hexidecimal color code that represents the mood of the entry. Example #0101fe for blue representing happiness."
      ),
    sentimentScore: z
      .number()
      .describe(
        "sentiment of the text and rated on a scale from -10 to 10, where -10 is extremely negative, 0 is neutral, and 10 is extremely positive."
      ),
  })
);

export const getPrompt = async (content: string) => {
  const format_instructions = parser.getFormatInstructions();

  const prompt = new PromptTemplate({
    template: `Analyze the following journal entry. Follow the instructions and format your response to match the format instructions, no matter what! \n{format_instructions}\n{entry}`,
    inputVariables: ["entry"],
    partialVariables: { format_instructions },
  });

  try {
    const input = await prompt.format({
      entry: content,
    });

    return input;
  } catch (error) {
    console.error(error);
  }
};

export const analyze = async (content: string) => {
  try {
    const input = await getPrompt(content);
    const model = new OpenAI({
      model: "gpt-3.5-turbo-instruct",
      temperature: 0,
      maxTokens: undefined,
      timeout: undefined,
      maxRetries: 2,
      apiKey: process.env.OPENAI_API_KEY,
    });
    if (input) {
      const result = await model.invoke(input);
      if (result) {
        return parser.parse(result);
      }
    }
  } catch (error) {
    console.error(error);
  }
};

export const qa = async (question, entries) => {
  const docs = entries.map((entry: any) => {
    return new Document({
      pageContent: entry.content,
      metadata: { id: entry.id, createdAt: entry.createdAt },
    });
  });

  const model = new OpenAI({
    model: "gpt-3.5-turbo-instruct",
    temperature: 0,
    maxTokens: undefined,
    timeout: undefined,
    maxRetries: 2,
    apiKey: process.env.OPENAI_API_KEY,
  });

  const chain = loadQARefineChain(model);
  const embeddings = new OpenAIEmbeddings();
  const store = await MemoryVectorStore.fromDocuments(docs, embeddings);
  const relevantDocs = await store.similaritySearch(question);
  const res = await chain.call({
    input_documents: relevantDocs,
    question,
  });

  return res.output_text;
};
