'use server';

/**
 * @fileOverview An AI agent that summarizes IT alerts for non-technical users.
 *
 * - summarizeAlerts - A function that summarizes IT alerts.
 * - SummarizeAlertsInput - The input type for the summarizeAlerts function.
 * - SummarizeAlertsOutput - The return type for the summarizeAlerts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeAlertsInputSchema = z.object({
  alerts: z
    .string()
    .describe('A list of IT alerts, including details like timestamp, severity, and description.'),
});
export type SummarizeAlertsInput = z.infer<typeof SummarizeAlertsInputSchema>;

const SummarizeAlertsOutputSchema = z.object({
  summary: z
    .string()
    .describe('A concise summary of the IT alerts, written in simple language for non-technical users.'),
});
export type SummarizeAlertsOutput = z.infer<typeof SummarizeAlertsOutputSchema>;

export async function summarizeAlerts(input: SummarizeAlertsInput): Promise<SummarizeAlertsOutput> {
  return summarizeAlertsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeAlertsPrompt',
  input: {schema: SummarizeAlertsInputSchema},
  output: {schema: SummarizeAlertsOutputSchema},
  prompt: `You are an AI assistant specializing in summarizing IT alerts for non-technical users.

  Given the following IT alerts, provide a concise summary in simple language that non-technical users can easily understand. Focus on the impact of the alerts and any necessary actions.

  Alerts:
  {{alerts}}

  Summary:
`,
});

const summarizeAlertsFlow = ai.defineFlow(
  {
    name: 'summarizeAlertsFlow',
    inputSchema: SummarizeAlertsInputSchema,
    outputSchema: SummarizeAlertsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
