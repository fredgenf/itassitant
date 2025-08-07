'use server';

/**
 * @fileOverview An AI agent that scores the risk level of a user or IP address.
 *
 * - scoreUserIpRisk - A function that analyzes activity data to produce a risk score.
 * - ScoreUserIpRiskInput - The input type for the scoreUserIpRisk function.
 * - ScoreUserIpRiskOutput - The return type for the scoreUserIpRisk function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ScoreUserIpRiskInputSchema = z.object({
  identifier: z.string().describe('The user name or IP address to be scored.'),
  activityData: z
    .string()
    .describe('A summary of activity associated with the identifier, e.g., "Multiple failed logins from 3 countries in 1 hour", "Accessed and downloaded 5GB from a sensitive fileshare".'),
});
export type ScoreUserIpRiskInput = z.infer<typeof ScoreUserIpRiskInputSchema>;

const ScoreUserIpRiskOutputSchema = z.object({
  riskScore: z
    .number()
    .min(0)
    .max(100)
    .describe('A risk score from 0 (no risk) to 100 (critical risk).'),
  riskLevel: z
    .enum(['Low', 'Medium', 'High', 'Critical'])
    .describe('The categorized risk level.'),
  keyRiskFactors: z
    .string()
    .describe('A markdown-formatted list of the top factors contributing to the risk score.'),
  recommendation: z
    .string()
    .describe('A recommended action based on the risk, e.g., "Monitor activity", "Require MFA re-authentication", "Temporarily disable account".'),
});
export type ScoreUserIpRiskOutput = z.infer<typeof ScoreUserIpRiskOutputSchema>;

export async function scoreUserIpRisk(
  input: ScoreUserIpRiskInput
): Promise<ScoreUserIpRiskOutput> {
  return scoreUserIpRiskFlow(input);
}

const prompt = ai.definePrompt({
  name: 'scoreUserIpRiskPrompt',
  input: {schema: ScoreUserIpRiskInputSchema},
  output: {schema: ScoreUserIpRiskOutputSchema},
  prompt: `You are a Senior Cybersecurity Analyst specializing in risk assessment and user behavior analytics. Your task is to calculate a risk score for a given user or IP address based on their recent activity.

  Analyze the provided activity data and calculate a risk score from 0 to 100.
  - 0-20: Low risk
  - 21-50: Medium risk
  - 51-80: High risk
  - 81-100: Critical risk

  Identify the key factors that contribute to this score and provide a clear recommendation for action.

  Identifier: {{identifier}}
  Activity Data:
  "{{activityData}}"
`,
});

const scoreUserIpRiskFlow = ai.defineFlow(
  {
    name: 'scoreUserIpRiskFlow',
    inputSchema: ScoreUserIpRiskInputSchema,
    outputSchema: ScoreUserIpRiskOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
