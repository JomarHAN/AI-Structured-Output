"use client";

import { Input } from "@/components/ui/input";
import { useState } from "react";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { RecipeSchema } from "@/src/recipeSchema";
import { Loading } from "@/components/loading";
import { RecipeCard } from "@/components/recipe-card";

export default function VercelAIPage() {
  const [prompt, setPrompt] = useState("Spashetti Bolognese");
  const { object, submit, isLoading } = useObject({
    schema: RecipeSchema,
    api: "/vercel-ai/api",
    initialValue: {
      name: "",
      ingredients: [],
      steps: [],
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <Input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            submit({ prompt });
            setPrompt("");
          }
        }}
        placeholder="What recipe do you want to generate?"
      />
      {isLoading && <Loading />}
      <RecipeCard
        recipe={
          object as {
            name: string;
            ingredients: { quantity: string; ingredient: string }[];
            steps: string[];
          }
        }
      />
    </div>
  );
}
