'use server';
/**
 * @fileOverview An AI Activity Architect that suggests personalized rehabilitation activities based on patient difficulties.
 *
 * - suggestRehabilitationActivities - A function that handles the suggestion process.
 * - SuggestRehabilitationActivitiesInput - The input type for the suggestRehabilitationActivities function.
 * - SuggestRehabilitationActivitiesOutput - The return type for the suggestRehabilitationActivities function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SuggestRehabilitationActivitiesInputSchema = z.object({
  motorDifficulties: z.array(z.string()).describe('A list of the patient\u0027s motor difficulties.'),
  cognitiveDifficulties: z.array(z.string()).describe('A list of the patient\u0027s cognitive difficulties.'),
  dailyActivityDifficulties: z.array(z.string()).describe('A list of the patient\u0027s daily activity difficulties.'),
});
export type SuggestRehabilitationActivitiesInput = z.infer<typeof SuggestRehabilitationActivitiesInputSchema>;

const SuggestedActivitySchema = z.object({
  name: z.string().describe('The name of the suggested rehabilitation activity.'),
  description: z.string().describe('A detailed description of the activity and its benefits.'),
  difficultyType: z.enum(['motor', 'cognitive', 'dailyActivity']).describe('The type of difficulty this activity primarily addresses.'),
});

const SuggestRehabilitationActivitiesOutputSchema = z.object({
  suggestedActivities: z.array(SuggestedActivitySchema).describe('A list of personalized rehabilitation activities.'),
});
export type SuggestRehabilitationActivitiesOutput = z.infer<typeof SuggestRehabilitationActivitiesOutputSchema>;

export async function suggestRehabilitationActivities(input: SuggestRehabilitationActivitiesInput): Promise<SuggestRehabilitationActivitiesOutput> {
  return suggestRehabilitationActivitiesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRehabilitationActivitiesPrompt',
  input: { schema: SuggestRehabilitationActivitiesInputSchema },
  output: { schema: SuggestRehabilitationActivitiesOutputSchema },
  prompt: `You are an AI Activity Architect specializing in rehabilitation planning. Your task is to analyze a patient's motor, cognitive, and daily activity difficulties and suggest personalized rehabilitation activities.

Analyze the following patient difficulties:

{{#if motorDifficulties.length}}
Motor Difficulties:
{{#each motorDifficulties}}
- {{{this}}}
{{/each}}
{{/if}}

{{#if cognitiveDifficulties.length}}
Cognitive Difficulties:
{{#each cognitiveDifficulties}}
- {{{this}}}
{{/each}}
{{/if}}

{{#if dailyActivityDifficulties.length}}
Daily Activity Difficulties:
{{#each dailyActivityDifficulties}}
- {{{this}}}
{{/each}}
{{/if}}

Based on these difficulties, suggest a list of personalized rehabilitation activities. Each activity should have a 'name', a 'description', and the 'difficultyType' it addresses (e.g., 'motor', 'cognitive', 'dailyActivity'). Provide the output as a JSON array of activity objects inside a 'suggestedActivities' field.
`,
});

const suggestRehabilitationActivitiesFlow = ai.defineFlow(
  {
    name: 'suggestRehabilitationActivitiesFlow',
    inputSchema: SuggestRehabilitationActivitiesInputSchema,
    outputSchema: SuggestRehabilitationActivitiesOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
