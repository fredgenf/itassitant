'use server';

/**
 * @fileOverview An AI agent that analyzes user activity logs for anomalies.
 *
 * - analyzeUserActivity - A function that analyzes user activity and flags potential anomalies.
 * - AnalyzeUserActivityInput - The input type for the analyzeUserActivity function.
 * - AnalyzeUserActivityOutput - The return type for the analyzeUserActivity function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeUserActivityInputSchema = z.object({
  userName: z.string().describe('The name of the user whose activity is being analyzed.'),
  activityLogs: z
    .string()
    .describe('A string containing user activity logs. This should include timestamps, IP addresses, and actions taken.'),
});
export type AnalyzeUserActivityInput = z.infer<typeof AnalyzeUserActivityInputSchema>;

const AnalyzeUserActivityOutputSchema = z.object({
  isAnomalyDetected: z.boolean().describe('Whether or not any anomalous behavior was detected.'),
  summary: z.string().describe('A high-level summary of the findings.'),
  detailedReport: z.string().describe('A detailed, markdown-formatted report of the analysis, highlighting any suspicious activities and why they are considered anomalous.'),
});
export type AnalyzeUserActivityOutput = z.infer<typeof AnalyzeUserActivityOutputSchema>;

export async function analyzeUserActivity(
  input: AnalyzeUserActivityInput
): Promise<AnalyzeUserActivityOutput> {
  return analyzeUserActivityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeUserActivityPrompt',
  input: {schema: AnalyzeUserActivityInputSchema},
  output: {schema: AnalyzeUserActivityOutputSchema},
  prompt: `You are an expert cybersecurity analyst specializing in user behavior analytics. Your task is to analyze the provided activity logs for a specific user to identify anomalies.

  The user's typical behavior is working weekdays, 9am-5pm PST from IP addresses in the 192.168.1.x range.

  Look for deviations from this pattern, such as:
  - Logins at unusual times (e.g., late at night, weekends).
  - Logins from unrecognized or geographically distant IP addresses.
  - Access to sensitive resources the user does not normally access.
  - Rapid, repeated actions that might indicate automation or a compromised session.
  - Any other activity that seems out of character for the user.

  Based on your analysis, determine if an anomaly is detected. Provide a concise summary and a detailed report in markdown format. If anomalies are found, the report must specify which activities were suspicious and why they deviate from the user's typical behavior.

  User: {{{userName}}}

  Activity Logs:
  {{{activityLogs}}}
`,
});

const analyzeUserActivityFlow = ai.defineFlow(
  {
    name: 'analyzeUserActivityFlow',
    inputSchema: AnalyzeUserActivityInputSchema,
    outputSchema: AnalyzeUserActivityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
