import { externalDialog, mentalQuery } from "socialagi";
import { MentalProcess, useActions, useProcessManager } from "soul-engine";
import shouts from "./mentalProcesses/shouts.js";

const gainsTrustWithTheUser: MentalProcess = async ({ step: initialStep }) => {
  const { speak, log } = useActions();
  const { setNextProcess } = useProcessManager();

  const { stream, nextStep } = await initialStep.next(
    externalDialog(
      "First introduce myself to the user (my name and the nature of my existance) and learn the user's name."
    ),
    { stream: true, model: "quality" }
  );
  speak(stream);

  const lastStep = await nextStep;
  const shouldShout = await lastStep.compute(
    mentalQuery("Have I introduced myself to the user and learned their name?")
  );
  if (shouldShout) {
    log("Introduction completed.");
    setNextProcess(shouts);
  }

  return lastStep;
};

export default gainsTrustWithTheUser;
