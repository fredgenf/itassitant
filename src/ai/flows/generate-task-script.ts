'use server';

/**
 * @fileOverview An AI agent that generates administrative scripts from natural language.
 *
 * - generateTaskScript - A function that creates a script based on a task description.
 * - GenerateTaskScriptInput - The input type for the generateTaskScript function.
 * - GenerateTaskScriptOutput - The return type for the generateTaskScript function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTaskScriptInputSchema = z.object({
  taskDescription: z
    .string()
    .describe('A natural language description of the task to be automated.'),
  os: z.enum(['windows', 'macos']).describe("The target operating system for the script. Use 'windows' for PowerShell and 'macos' for Bash."),
});
export type GenerateTaskScriptInput = z.infer<typeof GenerateTaskScriptInputSchema>;

const GenerateTaskScriptOutputSchema = z.object({
  script: z.string().describe('The generated script that performs the requested task.'),
  language: z.string().describe("The scripting language used (e.g., 'PowerShell' or 'Bash')."),
});
export type GenerateTaskScriptOutput = z.infer<typeof GenerateTaskScriptOutputSchema>;

export async function generateTaskScript(
  input: GenerateTaskScriptInput
): Promise<GenerateTaskScriptOutput> {
  return generateTaskScriptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTaskScriptPrompt',
  input: {schema: GenerateTaskScriptInputSchema},
  output: {schema: GenerateTaskScriptOutputSchema},
  prompt: `You are an expert IT administrator and script writer. Your task is to generate a script based on a natural language description of a task.

  - If the target OS is 'windows', you must generate a PowerShell script.
  - If the target OS is 'macos', you must generate a Bash (zsh compatible) script.
  - The script should be robust, include comments where necessary, and perform the requested task efficiently.
  - Do not include any introductory or explanatory text in the script output, only the code itself.

  Task: "{{taskDescription}}"
  Target OS: {{os}}
`,
});

const generateTaskScriptFlow = ai.defineFlow(
  {
    name: 'generateTaskScriptFlow',
    inputSchema: GenerateTaskScriptInputSchema,
    outputSchema: GenerateTaskScriptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
