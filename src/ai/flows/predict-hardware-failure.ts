'use server';

/**
 * @fileOverview An AI agent that predicts hardware failures from health metrics.
 *
 * - predictHardwareFailure - A function that analyzes hardware data to forecast failures.
 * - PredictHardwareFailureInput - The input type for the predictHardwareFailure function.
 * - PredictHardwareFailureOutput - The return type for the predictHardwareFailure function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictHardwareFailureInputSchema = z.object({
  componentType: z.enum(['Disk', 'Memory', 'CPU']).describe('The type of hardware component being analyzed.'),
  healthMetrics: z
    .string()
    .describe('A JSON string of relevant health metrics for the component (e.g., S.M.A.R.T. data for a disk, memory error counts, temperature logs for a CPU).'),
});
export type PredictHardwareFailureInput = z.infer<typeof PredictHardwareFailureInputSchema>;

const PredictHardwareFailureOutputSchema = z.object({
  isFailurePredicted: z.boolean().describe('Whether or not a failure is predicted within the near future.'),
  predictionSummary: z
    .string()
    .describe('A concise summary of the prediction, e.g., "Imminent disk failure due to high number of reallocated sectors."'),
  recommendedAction: z.string().describe('The recommended action to take, e.g., "Replace the disk immediately and restore from backup."'),
  confidence: z.enum(['High', 'Medium', 'Low']).describe('The confidence level in the prediction.'),
});
export type PredictHardwareFailureOutput = z.infer<typeof PredictHardwareFailureOutputSchema>;

export async function predictHardwareFailure(
  input: PredictHardwareFailureInput
): Promise<PredictHardwareFailureOutput> {
  return predictHardwareFailureFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictHardwareFailurePrompt',
  input: {schema: PredictHardwareFailureInputSchema},
  output: {schema: PredictHardwareFailureOutputSchema},
  prompt: `You are an expert hardware engineer and data scientist specializing in predictive maintenance. Your task is to analyze health metrics from a hardware component and predict if it is likely to fail.

  Component Type: {{componentType}}
  Health Metrics:
  {{{healthMetrics}}}

  Analyze the provided metrics for any signs of degradation or patterns that are precursors to failure.
  - For Disks, look at S.M.A.R.T. attributes like Reallocated Sectors Count, Command Timeout, and Media Wearout Indicator.
  - For Memory, look for ECC or CRC error counts.
  - For CPUs, look for high core temperatures, thermal throttling, or L2/L3 cache errors.

  Based on your analysis, determine if a failure is likely. Provide a summary of your findings, a recommended course of action, and your confidence level in this prediction. If no failure is predicted, state that the component appears healthy.
`,
});

const predictHardwareFailureFlow = ai.defineFlow(
  {
    name: 'predictHardwareFailureFlow',
    inputSchema: PredictHardwareFailureInputSchema,
    outputSchema: PredictHardwareFailureOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
