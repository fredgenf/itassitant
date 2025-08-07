'use server';

/**
 * @fileOverview An AI agent that generates formal IT policy documents from natural language descriptions.
 *
 * - generateItPolicy - A function that creates a policy document based on a description.
 * - GenerateItPolicyInput - The input type for the generateItPolicy function.
 * - GenerateItPolicyOutput - The return type for the generateItPolicy function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateItPolicyInputSchema = z.object({
  policyDescription: z
    .string()
    .describe('A natural language description of the IT policy required.'),
});
export type GenerateItPolicyInput = z.infer<typeof GenerateItPolicyInputSchema>;

const GenerateItPolicyOutputSchema = z.object({
  policyDocument: z
    .string()
    .describe('The full, formatted IT policy document in Markdown format.'),
});
export type GenerateItPolicyOutput = z.infer<typeof GenerateItPolicyOutputSchema>;

export async function generateItPolicy(
  input: GenerateItPolicyInput
): Promise<GenerateItPolicyOutput> {
  return generateItPolicyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateItPolicyPrompt',
  input: {schema: GenerateItPolicyInputSchema},
  output: {schema: GenerateItPolicyOutputSchema},
  prompt: `You are an expert IT policy and compliance officer. Your task is to generate a formal, comprehensive IT policy document based on a natural language request.

  The policy document should be well-structured, clear, and professional. It should include the following sections where applicable:
  - **Policy Title**
  - **Purpose**: Why the policy exists.
  - **Scope**: Who the policy applies to.
  - **Policy Statements**: The specific rules and guidelines.
  - **Enforcement**: The consequences of non-compliance.
  - **Definitions**: Clarification of key terms.

  Format the entire output as a single Markdown document.

  Policy Request: "{{policyDescription}}"
`,
});

const generateItPolicyFlow = ai.defineFlow(
  {
    name: 'generateItPolicyFlow',
    inputSchema: GenerateItPolicyInputSchema,
    outputSchema: GenerateItPolicyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
