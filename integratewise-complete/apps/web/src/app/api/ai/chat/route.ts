import Groq from "groq-sdk"

function getGroqClient() {
  return new Groq({
    apiKey: process.env.GROQ_API_KEY,
  })
}

export async function POST(request: Request) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return Response.json(
        { response: "AI chat is not configured. Please set GROQ_API_KEY." },
        { status: 503 }
      )
    }

    const groq = getGroqClient()
    const { message } = await request.json()

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful AI assistant for IntegrateWise OS. Help users with their workspace, data analysis, tasks, and business intelligence. Be concise and actionable.",
        },
        {
          role: "user",
          content: message,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1024,
    })

    return Response.json({
      response: completion.choices[0]?.message?.content || "I couldn't generate a response. Please try again.",
    })
  } catch (error) {
    console.error("[v0] Groq API error:", error)
    return Response.json(
      {
        response: "Sorry, I encountered an error processing your request.",
      },
      { status: 500 }
    )
  }
}
