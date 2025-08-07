'use server';

/**
 * @fileOverview An AI agent that performs root cause analysis on IT alerts.
 *
 * - getRootCauseAnalysis - A function that analyzes an alert and related data to find the root cause.
 * - GetRootCauseAnalysisInput - The input type for the getRootCauseAnalysis function.
 * - GetRootCauseAnalysisOutput - The return type for the getRootCauseAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetRootCauseAnalysisInputSchema = z.object({
  alertDescription: z.string().describe('The description of the IT alert.'),
  performanceData: z
    .string()
    .describe('A JSON string of relevant performance data points around the time of the alert.'),
  logs: z.string().describe('Relevant logs from the time of the alert.'),
});
export type GetRootCauseAnalysisInput = z.infer<typeof GetRootCauseAnalysisInputSchema>;

const GetRootCauseAnalysisOutputSchema = z.object({
  likelyCause: z
    .string()
    .describe('A detailed explanation of the most likely root cause of the issue, based on the provided data.'),
  confidence: z.enum(['High', 'Medium', 'Low']).describe('The confidence level in the analysis.'),
  suggestedRemediation: z
    .string()
    .describe('Actionable steps to remediate the issue.'),
});
export type GetRootCauseAnalysisOutput = z.infer<typeof GetRootCauseAnalysisOutputSchema>;

export async function getRootCauseAnalysis(
  input: GetRootCauseAnalysisInput
): Promise<GetRootCauseAnalysisOutput> {
  return getRootCauseAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getRootCauseAnalysisPrompt',
  input: {schema: GetRootCauseAnalysisInputSchema},
  output: {schema: GetRootCauseAnalysisOutputSchema},
  prompt: `You are an expert Site Reliability Engineer (SRE). Your task is to perform a root cause analysis for a given IT alert using the provided performance data and logs.

  Alert: "{{alertDescription}}"

  Correlate the information from the performance data and logs to determine the most probable cause.
  - Look for unusual spikes or drops in performance metrics (CPU, memory, network) that coincide with the alert.
  - Scan logs for error messages, warnings, or anomalous activity that could explain the alert.
  - Synthesize the information to form a coherent and logical conclusion.

  Based on your analysis, provide a detailed explanation of the likely root cause, your confidence in the finding, and a set of suggested steps to fix the issue.

  Performance Data:
  {{{performanceData}}}

  Logs:
  {{{logs}}}
`,
});

const getRootCauseAnalysisFlow = ai.defineFlow(
  {
    name: 'getRootCauseAnalysisFlow',
    inputSchema: GetRootCauseAnalysisInputSchema,
    outputSchema: GetRootCauseAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
