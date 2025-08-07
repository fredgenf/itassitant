'use server';

/**
 * @fileOverview An AI agent that analyzes security logs for potential threats.
 *
 * - analyzeSecurityLogs - A function that analyzes security logs and provides a threat report.
 * - AnalyzeSecurityLogsInput - The input type for the analyzeSecurityLogs function.
 * - AnalyzeSecurityLogsOutput - The return type for the analyzeSecurityLogs function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeSecurityLogsInputSchema = z.object({
  logs: z
    .string()
    .describe('A string containing security logs to be analyzed. This can include firewall logs, authentication logs, etc.'),
});
export type AnalyzeSecurityLogsInput = z.infer<typeof AnalyzeSecurityLogsInputSchema>;

const AnalyzeSecurityLogsOutputSchema = z.object({
  threatsFound: z.boolean().describe('Whether or not any potential threats were found in the logs.'),
  summary: z.string().describe('A high-level summary of the findings.'),
  detailedReport: z.string().describe('A detailed, markdown-formatted report of the analysis, including identified threats, patterns, and recommended actions.'),
});
export type AnalyzeSecurityLogsOutput = z.infer<typeof AnalyzeSecurityLogsOutputSchema>;

export async function analyzeSecurityLogs(
  input: AnalyzeSecurityLogsInput
): Promise<AnalyzeSecurityLogsOutput> {
  return analyzeSecurityLogsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeSecurityLogsPrompt',
  input: {schema: AnalyzeSecurityLogsInputSchema},
  output: {schema: AnalyzeSecurityLogsOutputSchema},
  prompt: `You are an expert cybersecurity analyst. Your task is to analyze the provided security logs to identify potential threats.

  Look for patterns that might indicate malicious activity, such as:
  - Repeated failed login attempts (potential brute-force attack).
  - Logins from unusual geographic locations.
  - Large data transfers to external IP addresses (potential data exfiltration).
  - Port scanning activity.
  - Any other suspicious log entries.

  Based on your analysis, determine if threats were found. Provide a concise summary and a detailed report of your findings in markdown format. If threats are found, the report should include the nature of the threat, the evidence from the logs, and recommended mitigation steps.

  If no threats are found, state that the logs appear normal.

  Security Logs:
  {{{logs}}}
`,
});

const analyzeSecurityLogsFlow = ai.defineFlow(
  {
    name: 'analyzeSecurityLogsFlow',
    inputSchema: AnalyzeSecurityLogsInputSchema,
    outputSchema: AnalyzeSecurityLogsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
