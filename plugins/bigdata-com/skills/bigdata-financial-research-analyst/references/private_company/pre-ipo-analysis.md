---
name: ipo-analysis
description: Pre-listing IPO research note for an upcoming IPO. Use when the user asks to analyze, research, or evaluate a company's upcoming IPO, an S-1/F-1 filing, or a planned stock market listing. Produces institutional-style report content with deal structure, financials, valuation framing, sentiment, and balanced bull/bear debates - no buy/avoid recommendation. Triggers: "analyze the IPO of X", "IPO report", "upcoming listing", "S-1 analysis", "should I look at X's IPO".
---

# IPO Analysis - Pre-Listing Research Note

Produce institutional research on an upcoming (not yet listed) IPO. Markdown in chat is the default; ask before creating, saving, or exporting a formal report file.

## Scope rules

- Upcoming IPOs only. If the company has already listed, tell the user this skill covers pre-listing analysis and offer a post-IPO review instead before proceeding.
- Balanced framing only. Never give a participate/wait/avoid recommendation, price target, or conviction rating. Present bull case, bear case, and watch points; let the reader decide.
- No invented data. If a figure (e.g., price range, offer size) is not yet public, state "not yet disclosed" rather than estimating. Clearly label any third-party estimates as such.

## Workflow

### 1. Clarify input
Required: company name. If ambiguous (multiple companies with similar names), confirm with the user. Note expected exchange/geography if known.

### 2. Research (complete BEFORE building the report)

Run searches in this order; keep each search to one focus and one time period. Use web/browser search only when those tools are available; otherwise use Bigdata.com MCP data plus user-provided filings or links and clearly call out missing public-source checks.

a. Filing facts: latest S-1/F-1/prospectus or equivalent - price range, shares offered (primary vs secondary), greenshoe, implied valuation, underwriters, expected pricing/listing date, exchange, ticker, use of proceeds, lock-up terms, share class structure, cornerstone investors.
b. Financials: 2 most recent fiscal years + latest interim period - revenue, gross margin, operating income/loss, net income, operating cash flow, FCF, cash and debt position.
c. Company background (Bigdata.com `bigdata_search` + web): business model, segments, customers, management, funding history and last private-round valuation.
d. Industry/peers: TAM estimates, competitive set, 3–6 listed comparables with current EV/Sales, EV/EBITDA, or P/E as applicable.
e. IPO window (Bigdata.com `bigdata_search` + web): current IPO market conditions, recent debuts in the same sector and their aftermarket performance.
f. Sentiment (Bigdata.com): news flow and sentiment on the issuer over the last 90 days. Resolve the entity with `find_securities` first if a tearsheet is needed.

Fallback: if Bigdata.com tools are unavailable and web/browser tools are available, complete the steps with public-source research only and note that sentiment/entity data was limited. If neither is available, ask the user for the relevant filings or links before continuing.

Record source name + date for every material fact as you go.

### 3. Build the report

Follow the section structure in `assets/templates/pre-ipo-report-template.md`. Do not start file generation until research is complete and the user has explicitly asked for an exported report.

### 4. Verify

Before delivering: check every number in the report against a recorded source; check internal consistency (implied valuation = price × shares outstanding post-offering); confirm all 9 sections present; confirm no recommendation language slipped in ("we recommend", "attractive entry", "avoid").

## Output

- Default: markdown in chat.
- Optional file, only after user approval: `IPO_Analysis_<Company>_<YYYY-MM-DD>.md`, `.docx`, or `.pdf` saved to the user's requested workspace path.
- Length: 6–10 pages when exported.
- Cover page: company name, "Pre-IPO Research Note", date, "Prepared with Cline".
- Inline citations: Use [1], [2], etc. after claims from sources
- Full Sources section at the end. When Bigdata.com content is used, brand it exactly "Bigdata.com" with a link to the source using the value in the url parameter from the `bigdata_search` response
