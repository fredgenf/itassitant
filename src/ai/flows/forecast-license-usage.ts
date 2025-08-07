'use server';

/**
 * @fileOverview An AI agent that forecasts software license needs and costs.
 *
 * - forecastLicenseUsage - A function that analyzes usage data to predict future needs.
 * - ForecastLicenseUsageInput - The input type for the forecastLicenseUsage function.
 * - ForecastLicenseUsageOutput - The return type for the forecastLicenseUsage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ForecastLicenseUsageInputSchema = z.object({
  softwareName: z.string().describe('The name of the software being analyzed.'),
  currentLicenses: z.number().describe('The number of licenses currently owned.'),
  licenseCost: z.number().describe('The cost per license per month.'),
  historicalUsage: z
    .string()
    .describe('A JSON string representing an array of monthly active user counts for the past year.'),
});
export type ForecastLicenseUsageInput = z.infer<typeof ForecastLicenseUsageInputSchema>;

const ForecastLicenseUsageOutputSchema = z.object({
  predictedUsersNextQuarter: z.number().describe('The predicted average number of active users for the next quarter.'),
  licensesNeeded: z.number().describe('The total number of licenses recommended for the next quarter.'),
  licenseShortfall: z.number().describe('The number of additional licenses that need to be purchased.'),
  predictedCostNextQuarter: z.number().describe('The total predicted software cost for the next quarter (3 months).'),
  recommendation: z
    .string()
    .describe('A summary of the forecast and a clear recommendation (e.g., "Purchase X more licenses to meet projected demand.").'),
});
export type ForecastLicenseUsageOutput = z.infer<typeof ForecastLicenseUsageOutputSchema>;

export async function forecastLicenseUsage(
  input: ForecastLicenseUsageInput
): Promise<ForecastLicenseUsageOutput> {
  return forecastLicenseUsageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'forecastLicenseUsagePrompt',
  input: {schema: ForecastLicenseUsageInputSchema},
  output: {schema: ForecastLicenseUsageOutputSchema},
  prompt: `You are an expert IT asset manager and financial analyst. Your task is to forecast software license needs and costs based on historical usage data.

  Software: {{softwareName}}
  Current Licenses: {{currentLicenses}}
  Cost per License (Monthly): \${{licenseCost}}
  Historical Usage (monthly active users):
  {{{historicalUsage}}}

  Analyze the historical usage data to identify trends (e.g., growth rate, seasonality).
  1.  Predict the average number of active users for the next quarter (next 3 months).
  2.  Recommend the total number of licenses needed to support the predicted usage, including a small buffer (around 10-15%).
  3.  Calculate the license shortfall (licenses needed - current licenses). If there is no shortfall, this should be 0.
  4.  Calculate the total predicted cost for the next quarter (3 months) based on the recommended number of licenses.
  5.  Provide a concise recommendation based on your findings.
`,
});

const forecastLicenseUsageFlow = ai.defineFlow(
  {
    name: 'forecastLicenseUsageFlow',
    inputSchema: ForecastLicenseUsageInputSchema,
    outputSchema: ForecastLicenseUsageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
