// Feature flags — set via Vercel env vars, no redeployment needed.
// NEXT_PUBLIC_ prefix makes them available in the browser.

export const FLAGS = {
  // Show revenue, fees, and financial quick actions.
  // Set NEXT_PUBLIC_SHOW_FINANCIALS=true in Vercel to enable.
  showFinancials: process.env.NEXT_PUBLIC_SHOW_FINANCIALS === "true",
}
