export const parseArgs = () => {
  let projectName;
  const projectArg = process.argv.find((arg) => arg.startsWith('-p='));
  if (projectArg) {
    projectName = projectArg.slice('-p='.length);
  }

  let projectIndex = -1;
  const projectIndexArg = process.argv.find((arg) => arg.startsWith('-i='));
  if (projectIndexArg) {
    projectIndex = projectIndexArg.slice('-i='.length);
  }

  return {
    projectName,
    projectIndex,
  };
};
