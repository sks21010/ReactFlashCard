"use server"

import { NextResponse } from "next/server";

import OpenAI from "openai";

const systemPrompt = `
You are a flashcard creator, you take in text and create multiple flashcards from it. Make sure to create exactly 10 flashcards.
Both front and back should be one sentence long.
You should return in the following JSON format:
Create 10 Flashcards:
{
  "flashcards": [
    {
      "front": "Front of the card",
      "back": "Back of the card"
    }
  ]
}
`;


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req) {    

    const data = await req.text()

    const completion = await openai.chat.completions.create({

    messages: [
        {role: "system", content: systemPrompt  },
        {role: "user", content: data},

    ],
    model: "gpt-4o-mini" ,
    response_format: {
       type: 'json_object'
    }
   
    })

    const flashcards = JSON.parse(completion.choices[0].message.content)
    return NextResponse.json(flashcards.flashcards)

}