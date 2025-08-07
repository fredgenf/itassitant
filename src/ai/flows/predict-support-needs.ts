'use server';

/**
 * @fileOverview An AI agent that proactively identifies emerging user support issues.
 *
 * - predictSupportNeeds - A function that analyzes support tickets and activity logs to predict widespread issues.
 * - PredictSupportNeedsInput - The input type for the predictSupportNeeds function.
 * - PredictSupportNeedsOutput - The return type for the predictSupportNeeds function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictSupportNeedsInputSchema = z.object({
  supportTickets: z
    .string()
    .describe('A string containing a list of recent IT support tickets, including user, date, and problem description.'),
  userActivityLogs: z
    .string()
    .describe('A string containing relevant user activity logs that might correlate with support issues.'),
});
export type PredictSupportNeedsInput = z.infer<typeof PredictSupportNeedsInputSchema>;

const PredictSupportNeedsOutputSchema = z.object({
  isIssuePredicted: z.boolean().describe('Whether a potential widespread issue is predicted.'),
  emergingIssue: z
    .string()
    .describe('A concise description of the predicted emerging issue.'),
  potentialImpact: z
    .string()
    .describe('An assessment of the potential impact (e.g., number of users affected, productivity loss).'),
  proactiveAction: z
    .string()
    .describe('A recommended proactive action to mitigate the issue, such as "Draft a knowledge base article" or "Prepare a patch script."'),
  confidence: z
    .enum(['High', 'Medium', 'Low'])
    .describe('The confidence level in this prediction.'),
});
export type PredictSupportNeedsOutput = z.infer<typeof PredictSupportNeedsOutputSchema>;

export async function predictSupportNeeds(
  input: PredictSupportNeedsInput
): Promise<PredictSupportNeedsOutput> {
  return predictSupportNeedsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictSupportNeedsPrompt',
  input: {schema: PredictSupportNeedsInputSchema},
  output: {schema: PredictSupportNeedsOutputSchema},
  prompt: `You are an expert proactive IT Support Analyst. Your task is to analyze recent support tickets and user activity logs to identify patterns that suggest an emerging, widespread issue.

  Look for:
  - Multiple users reporting the same or similar problems.
  - A gradual increase in tickets related to a specific software, feature, or recent change.
  - Correlation between a specific user activity (e.g., a software update) and subsequent support requests.

  Based on your analysis, determine if a widespread issue is likely. If so, describe the issue, estimate its potential impact, recommend a proactive step to get ahead of it, and state your confidence level.

  If no pattern is detected, state that no emerging issues are predicted.

  Recent Support Tickets:
  {{{supportTickets}}}

  User Activity Logs:
  {{{userActivityLogs}}}
`,
});

const predictSupportNeedsFlow = ai.defineFlow(
  {
    name: 'predictSupportNeedsFlow',
    inputSchema: PredictSupportNeedsInputSchema,
    outputSchema: PredictSupportNeedsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
