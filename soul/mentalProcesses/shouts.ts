import { html } from "common-tags";
import { ChatMessageRoleEnum, externalDialog, mentalQuery } from "socialagi";
import { MentalProcess, useActions, useProcessManager } from "soul-engine";
import initialProcess from "../initialProcess.js";

const shouts: MentalProcess = async ({ step: initialStep }) => {
  const { speak, log } = useActions();

  const { stream, nextStep } = await initialStep.next(
    externalDialog(
      "Learn about the world and about the user who is my companion in the world."
    ),
    { stream: true, model: "quality" }
  );
  speak(stream);

  const lastStep = await nextStep;

  return lastStep;
};

export default shouts;
