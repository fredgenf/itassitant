'use server';

/**
 * @fileOverview This file defines a Genkit flow for troubleshooting IT problems described in natural language.
 *
 * - troubleshootProblems - A function that takes a user's problem description and returns step-by-step troubleshooting instructions.
 * - TroubleshootProblemsInput - The input type for the troubleshootProblems function.
 * - TroubleshootProblemsOutput - The return type for the troubleshootProblems function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TroubleshootProblemsInputSchema = z.object({
  problemDescription: z
    .string()
    .describe('A description of the IT problem encountered by the user.'),
});
export type TroubleshootProblemsInput = z.infer<typeof TroubleshootProblemsInputSchema>;

const TroubleshootProblemsOutputSchema = z.object({
  troubleshootingInstructions: z
    .string()
    .describe('Step-by-step instructions to troubleshoot the described problem.'),
});
export type TroubleshootProblemsOutput = z.infer<typeof TroubleshootProblemsOutputSchema>;

export async function troubleshootProblems(input: TroubleshootProblemsInput): Promise<TroubleshootProblemsOutput> {
  return troubleshootProblemsFlow(input);
}

const troubleshootProblemsPrompt = ai.definePrompt({
  name: 'troubleshootProblemsPrompt',
  input: {schema: TroubleshootProblemsInputSchema},
  output: {schema: TroubleshootProblemsOutputSchema},
  prompt: `You are an AI IT assistant that helps users troubleshoot their IT problems.

  Provide step-by-step instructions to resolve the following problem:

  {{problemDescription}}
  `,
});

const troubleshootProblemsFlow = ai.defineFlow(
  {
    name: 'troubleshootProblemsFlow',
    inputSchema: TroubleshootProblemsInputSchema,
    outputSchema: TroubleshootProblemsOutputSchema,
  },
  async input => {
    const {output} = await troubleshootProblemsPrompt(input);
    return output!;
  }
);
