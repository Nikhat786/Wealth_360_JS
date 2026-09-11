/**
 * sheru-api.js
 * ---------------------------------------------------------------------------
 * Thin client for the Sharekhan MCP LLM endpoint (qwen3-4b-instruct).
 *
 * The caller is responsible for supplying a rich system prompt so the model
 * has full financial context about the user.  On network failure or non-200
 * response the function rejects, and the caller should gracefully fall back
 * to the offline coachReply rule engine.
 */

// Relative path — Vite proxies this to https://mcpuat.sharekhan.com/api/v1/chat/completions
// See vite.config.js  server.proxy["/api/sharekhan"]
const LLM_PROXY_PATH = "/api/sharekhan";
const LLM_MODEL = "qwen3-4b-instruct";
const MAX_TOKENS = 512;

/**
 * Build a detailed system prompt that grounds the LLM in Rahul-s financial
 * universe, preventing hallucination and keeping responses relevant.
 *
 * @param {object} ctx  - coachContext values from AppContext
 * @returns {string}
 */
export function buildSystemPrompt(ctx) {
  return `You are SHERU - an expert AI Wealth Coach built into WealthVerse byMirae Asset.
Your sole job is to give clear, concise, personalised wealth-advisory answers about the following client profile.

## Client Financial Profile
- Wealth Health Score: ${ctx.score}/100 (Grade: ${ctx.grade})
- Net Worth: Rs.${(ctx.netWorth / 100000).toFixed(1)} L
- Monthly Income: Rs.${ctx.monthlyIncome?.toLocaleString("en-IN") ?? "-"}
- Monthly Expenses: Rs.${ctx.monthlyExpenses?.toLocaleString("en-IN") ?? "-"}
- Monthly EMI: Rs.${ctx.monthlyEmi?.toLocaleString("en-IN") ?? "-"}
- Emergency Fund: ${ctx.emergencyMonths?.toFixed(1) ?? "-"} months
- Life Cover: Rs.${(ctx.lifeCover / 100000).toFixed(1)} L
- Health Cover: Rs.${(ctx.healthCover / 100000).toFixed(1)} L
- Tax Headroom: Rs.${(ctx.taxHeadroom / 100000).toFixed(1)} L
- Idle Surplus: Rs.${(ctx.idleSurplus / 100000).toFixed(1)} L
- Goals Off Track: ${ctx.goalsOffTrack}
- Goals Shortfall: Rs.${(ctx.goalsShortfall / 100000).toFixed(1)} L
- Protection Score: ${ctx.protection}
- Transfer Readiness: ${ctx.transferReadiness}
- Top Priority Action: ${ctx.topAction ?? "none"}

## Behaviour Rules
1. Answer ONLY in the context of the above financial data.
2. Be concise - 3-5 sentences or a short bullet list.
3. Always name the client as "Rahul".
4. Do NOT mention competitor brands or products.
5. Do NOT make up numbers; use the profile data above.
6. Suggest actionable next steps aligned to WealthVerse features (Goals, Protection, Tax, Debt, Transfer).
7. End every response with 1-2 relevant follow-up questions the client might want to ask.`;
}

/**
 * Call the Sharekhan LLM endpoint.
 *
 * @param {string}   userMessage - the raw user message text
 * @param {object}   ctx         - coachContext from AppContext
 * @param {Array}    [history]   - previous {role, text} pairs for multi-turn context
 * @returns {Promise<string>}    - the assistant reply text
 */
export async function callSheruLLM(userMessage, ctx, history = []) {
  const systemPrompt = buildSystemPrompt(ctx);

  const messages = [
    { role: "system", content: [{ type: "text", text: systemPrompt }] },
    // Inject the last few turns for continuity (cap at 6 to stay within token budget)
    ...history.slice(-6).map(({ role, text }) => ({
      role,
      content: [{ type: "text", text }]
    })),
    { role: "user", content: [{ type: "text", text: userMessage }] }
  ];

  const response = await fetch(LLM_PROXY_PATH, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: LLM_MODEL,
      messages,
      max_tokens: MAX_TOKENS,
      stream: false
    })
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText);
    throw new Error(`Sheru LLM API error ${response.status}: ${errorText}`);
  }

  const data = await response.json();

  // Standard OpenAI-compatible response shape
  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error("Sheru LLM returned an empty response.");

  return content.trim();
}
