export async function POST(request) {
  try {
    const { text } = await request.json();

    if (!text || text.trim().length < 3) {
      return Response.json(
        { error: "Please enter how you are feeling." },
        { status: 400 },
      );
    }

    const prompt = `A student shared: "${text}"

Analyze their stress and respond with ONLY a valid JSON object, no extra text:
{
  "score": <number 0-100>,
  "level": <"low" or "moderate" or "high">,
  "level_label": <"Low Stress" or "Moderate Stress" or "High Stress">,
  "score_desc": <one sentence about what this score means for them personally>,
  "insight": <2-3 warm empathetic sentences about their emotional state>,
  "main_stressor": <one sentence about main cause, or null>,
  "suggestions": [
    {"icon":"<emoji>","name":"<short name>","desc":"<one specific helpful sentence>"},
    {"icon":"<emoji>","name":"<short name>","desc":"<one specific helpful sentence>"},
    {"icon":"<emoji>","name":"<short name>","desc":"<one specific helpful sentence>"},
    {"icon":"<emoji>","name":"<short name>","desc":"<one specific helpful sentence>"}
  ]
}
Scoring guide: 0-30 = low, 31-65 = moderate, 66-100 = high stress.
Be warm, empathetic, not clinical. Suggestions must be specific to what they shared.
Return ONLY the JSON object.`;

    const res = await fetch(`https://api.groq.com/openai/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 900,
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error("Gemini error:", errBody);
      return Response.json(
        { error: "AI service error. Please try again." },
        { status: 500 },
      );
    }

    const data = await res.json();
    let raw = (data.choices?.[0]?.message?.content || "").trim();

    raw = raw
      .replace(/^```[a-z]*\n?/i, "")
      .replace(/\n?```$/, "")
      .trim();

    let result;
    try {
      result = JSON.parse(raw);
    } catch {
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) result = JSON.parse(match[0]);
      else throw new Error("Could not parse AI response");
    }

    return Response.json({ result });
  } catch (err) {
    console.error("Analyze error:", err);
    return Response.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
