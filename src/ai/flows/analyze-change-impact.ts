'use server';

/**
 * @fileOverview An AI agent that analyzes the potential impact of a proposed IT change.
 *
 * - analyzeChangeImpact - A function that analyzes a change and provides an impact report.
 * - AnalyzeChangeImpactInput - The input type for the analyzeChangeImpact function.
 * - AnalyzeChangeImpactOutput - The return type for the analyzeChangeImpact function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeChangeImpactInputSchema = z.object({
  changeDescription: z
    .string()
    .describe('A detailed description of the proposed change (e.g., software update, firewall rule change).'),
  systemContext: z
    .string()
    .describe('Information about the current system state, including relevant configurations, dependencies, and architecture.'),
});
export type AnalyzeChangeImpactInput = z.infer<typeof AnalyzeChangeImpactInputSchema>;

const AnalyzeChangeImpactOutputSchema = z.object({
  impactAnalysis: z
    .string()
    .describe('A detailed, markdown-formatted report of the potential impact, covering conflicts, dependencies, and security risks.'),
  riskLevel: z
    .enum(['Low', 'Medium', 'High', 'Critical'])
    .describe('The assessed risk level of the proposed change.'),
});
export type AnalyzeChangeImpactOutput = z.infer<typeof AnalyzeChangeImpactOutputSchema>;

export async function analyzeChangeImpact(
  input: AnalyzeChangeImpactInput
): Promise<AnalyzeChangeImpactOutput> {
  return analyzeChangeImpactFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeChangeImpactPrompt',
  input: {schema: AnalyzeChangeImpactInputSchema},
  output: {schema: AnalyzeChangeImpactOutputSchema},
  prompt: `You are an expert IT strategist and systems architect. Your task is to analyze the potential impact of a proposed change on an IT system.

  Evaluate the proposed change in the context of the current system state. Identify potential risks, conflicts, and cascading failures.

  Your analysis must cover:
  - **Direct Impact**: What components will be directly affected?
  - **Dependencies**: Which other services, applications, or users depend on the affected components?
  - **Conflicts**: Could this change conflict with other planned changes or existing processes?
  - **Security Risks**: Does this change introduce any new vulnerabilities or security gaps?
  - **Rollback Plan**: Briefly suggest the complexity of rolling back this change if issues arise.

  Assign a risk level to the change based on your analysis.

  Proposed Change:
  "{{changeDescription}}"

  System Context:
  {{{systemContext}}}
`,
});

const analyzeChangeImpactFlow = ai.defineFlow(
  {
    name: 'analyzeChangeImpactFlow',
    inputSchema: AnalyzeChangeImpactInputSchema,
    outputSchema: AnalyzeChangeImpactOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
