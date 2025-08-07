'use server';

/**
 * @fileOverview An AI agent that anticipates phishing attacks based on threat intelligence.
 *
 * - anticipatePhishing - A function that analyzes threat data to predict phishing tactics.
 * - AnticipatePhishingInput - The input type for the anticipatePhishing function.
 * - AnticipatePhishingOutput - The return type for the anticipatePhishing function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnticipatePhishingInputSchema = z.object({
  threatIntelligence: z
    .string()
    .describe('A description of current phishing campaigns, targeted sectors, or new malware being distributed via email.'),
});
export type AnticipatePhishingInput = z.infer<typeof AnticipatePhishingInputSchema>;

const AnticipatePhishingOutputSchema = z.object({
  predictedTactics: z
    .string()
    .describe('A markdown-formatted summary of the likely phishing tactics (e.g., fake login pages for Office 365, emails with malicious attachments disguised as invoices).'),
  likelyTargets: z.string().describe('The departments or user roles most likely to be targeted (e.g., "Finance department", "New employees").'),
  recommendedActions: z.string().describe('A list of proactive steps to take, such as "Block IOCs", "Run a simulation", or "Send a warning bulletin to specific users".'),
});
export type AnticipatePhishingOutput = z.infer<typeof AnticipatePhishingOutputSchema>;

export async function anticipatePhishing(
  input: AnticipatePhishingInput
): Promise<AnticipatePhishingOutput> {
  return anticipatePhishingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'anticipatePhishingPrompt',
  input: {schema: AnticipatePhishingInputSchema},
  output: {schema: AnticipatePhishingOutputSchema},
  prompt: `You are an expert cyber threat intelligence analyst. Your task is to analyze the provided threat intelligence and predict how it might translate into specific phishing attacks against our company.

  Our company is a small-to-medium enterprise (SME) in the manufacturing sector.

  Based on the threat intel, predict the following:
  1.  **Likely Tactics**: What specific methods will attackers use? (e.g., Spear phishing, brand impersonation, malicious attachments). Be specific.
  2.  **Likely Targets**: Which departments or user roles are the most probable targets for this type of attack within our company?
  3.  **Recommended Actions**: What concrete, proactive steps should we take to defend against this threat?

  Threat Intelligence:
  "{{threatIntelligence}}"
`,
});

const anticipatePhishingFlow = ai.defineFlow(
  {
    name: 'anticipatePhishingFlow',
    inputSchema: AnticipatePhishingInputSchema,
    outputSchema: AnticipatePhishingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
