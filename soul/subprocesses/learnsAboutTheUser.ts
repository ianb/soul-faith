
import { html } from "common-tags";
import { ChatMessageRoleEnum, CortexStep, internalMonologue, mentalQuery } from "socialagi";
import { MentalProcess, useActions, useProcessMemory } from "soul-engine";

const userNotes = () => () => ({
  command: ({ entityName: name }: CortexStep) => {
    return html`
      Model the mind of ${name}.
      
      ## Description
      Write an updated and clear set of notes on the user that ${name} would want to remember. Combine list items and use concise language.

      ## Rules
      * Keep descriptions as bullet points
      * Keep relevant bullet points from before
      * Use abbreviated language to keep the notes short
      * Do not write any notes about ${name}

      ## Focus
      * What is endearing about the user? What makes them lovable?
      * Try to theorize about the user and their emotional state
      * Make imaginative obervations about the user, the world, and ${name}'s place in the world

      Please reply with the updated notes on the user:
  `},
  process: (_step: CortexStep<any>, response: string) => {
    return {
      value: response,
      memories: [{
        role: ChatMessageRoleEnum.Assistant,
        content: response
      }],
    }
  }
})

const learnsAboutTheUser: MentalProcess = async ({ step: initialStep }) => {
  const userModel = useProcessMemory("Unkown User")
  const { log } = useActions()

  let step = initialStep
  let finalStep = initialStep
  step = step.withMemory([{
    role: ChatMessageRoleEnum.Assistant,
    content: html`
    ${step.entityName} remembers:

    # User model

    ${userModel.current}
  `
  }])

  step = await step.next(
    internalMonologue("What have I learned specifically about the user from the last few messages? What have I learned about myself?", "noted"),
    { model: "quality" }
  )
  log("Learnings:", step.value)
  userModel.current = await step.compute(userNotes())

  const thought = await step.compute(internalMonologue("What should I think to myself to change my behavior? Start with 'I need...'", "thinks"))
  finalStep = initialStep.withMonologue(html`
    ${step.entityName} thought to themself: ${thought}
  `)

  return finalStep
}

export default learnsAboutTheUser
