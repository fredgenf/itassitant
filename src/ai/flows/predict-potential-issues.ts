'use server';

/**
 * @fileOverview An AI agent that predicts potential IT issues from performance data.
 *
 * - predictPotentialIssues - A function that analyzes performance data to forecast issues.
 * - PredictPotentialIssuesInput - The input type for the predictPotentialIssues function.
 * - PredictPotentialIssuesOutput - The return type for the predictPotentialIssues function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictPotentialIssuesInputSchema = z.object({
  performanceData: z
    .string()
    .describe('A JSON string representing an array of performance data points over time. Each data point includes cpu, memory, and network usage.'),
});
export type PredictPotentialIssuesInput = z.infer<typeof PredictPotentialIssuesInputSchema>;

const PredictPotentialIssuesOutputSchema = z.object({
  prediction: z.string().describe('A summary of the potential issue predicted from the data, including what might happen and when.'),
  severity: z.string().describe("The predicted severity of the issue, rated as 'High', 'Medium', or 'Low'."),
});
export type PredictPotentialIssuesOutput = z.infer<typeof PredictPotentialIssuesOutputSchema>;

export async function predictPotentialIssues(
  input: PredictPotentialIssuesInput
): Promise<PredictPotentialIssuesOutput> {
  return predictPotentialIssuesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictPotentialIssuesPrompt',
  input: {schema: PredictPotentialIssuesInputSchema},
  output: {schema: PredictPotentialIssuesOutputSchema},
  prompt: `You are an AI IT operations expert specializing in predictive analysis.

  Analyze the following time-series performance data. Look for trends that indicate potential future problems, such as resource exhaustion, sustained high usage, or unusual patterns.

  Based on your analysis, predict a potential future issue. Describe what might happen and estimate a potential timeframe. Assign a severity level to the predicted issue.

  If there are no obvious negative trends, state that the system is stable.

  Performance Data:
  {{performanceData}}
`,
});

const predictPotentialIssuesFlow = ai.defineFlow(
  {
    name: 'predictPotentialIssuesFlow',
    inputSchema: PredictPotentialIssuesInputSchema,
    outputSchema: PredictPotentialIssuesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
