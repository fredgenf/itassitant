// This file is machine-generated - edit with caution!

'use server';

/**
 * @fileOverview An AI agent that suggests security improvements based on system configuration and potential vulnerabilities.
 *
 * - suggestSecurityImprovements - A function that suggests security improvements.
 * - SuggestSecurityImprovementsInput - The input type for the suggestSecurityImprovements function.
 * - SuggestSecurityImprovementsOutput - The return type for the suggestSecurityImprovements function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestSecurityImprovementsInputSchema = z.object({
  systemConfiguration: z
    .string()
    .describe('Detailed information about the current system configuration, including operating systems, installed software, network settings, and user access privileges.'),
  knownVulnerabilities: z
    .string()
    .describe('A list of known vulnerabilities relevant to the system, including CVE IDs and descriptions.'),
});
export type SuggestSecurityImprovementsInput = z.infer<typeof SuggestSecurityImprovementsInputSchema>;

const SuggestSecurityImprovementsOutputSchema = z.object({
  suggestedImprovements: z
    .string()
    .describe('A list of actionable security improvements, including specific steps and justifications.'),
  riskAssessment: z
    .string()
    .describe('An assessment of the potential risks associated with not implementing the suggested improvements.'),
});
export type SuggestSecurityImprovementsOutput = z.infer<typeof SuggestSecurityImprovementsOutputSchema>;

export async function suggestSecurityImprovements(
  input: SuggestSecurityImprovementsInput
): Promise<SuggestSecurityImprovementsOutput> {
  return suggestSecurityImprovementsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestSecurityImprovementsPrompt',
  input: {schema: SuggestSecurityImprovementsInputSchema},
  output: {schema: SuggestSecurityImprovementsOutputSchema},
  prompt: `You are an AI cybersecurity expert tasked with analyzing system configurations and suggesting security improvements.

  Based on the provided system configuration and known vulnerabilities, suggest actionable security improvements.
  Include specific steps and justifications for each improvement. Also, assess the potential risks of not implementing the suggested improvements.

  System Configuration:
  {{systemConfiguration}}

  Known Vulnerabilities:
  {{knownVulnerabilities}}

  Respond with a list of actionable security improvements, including specific steps and justifications, and an assessment of the potential risks associated with not implementing the suggested improvements.
  `,
});

const suggestSecurityImprovementsFlow = ai.defineFlow(
  {
    name: 'suggestSecurityImprovementsFlow',
    inputSchema: SuggestSecurityImprovementsInputSchema,
    outputSchema: SuggestSecurityImprovementsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
