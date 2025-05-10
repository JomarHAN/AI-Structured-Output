import OpenAI from "openai";
import { NextResponse } from "next/server";
import { zodResponseFormat } from "openai/helpers/zod";
import { RecipeSchema } from "@/src/recipeSchema";

const modelName = "gpt-4o";

export async function POST(req: Request) {
  const { recipe } = await req.json();
  const client = new OpenAI();

  const response = await client.chat.completions.create({
    model: modelName,
    messages: [
      {
        role: "user",
        content: `Generate a recipe for ${recipe} || chocolate brownies`,
      },
    ],
    response_format: zodResponseFormat(RecipeSchema, "recipeSchema"),
    stream: true,
  });

  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of response) {
        const content = chunk.choices[0]?.delta?.content || "";

        controller.enqueue(new TextEncoder().encode(content));
      }
      controller.close();
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/plain",
      "Transfer-Encoding": "chunked",
    },
  });
}
