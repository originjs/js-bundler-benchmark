export const parseArgs = () => {
	let projectName;
	const projectArg = process.argv.find((arg) => arg.startsWith("-p="));
	if (projectArg) {
		projectName = projectArg.slice("-p=".length);
	}

	let indexes = [];
	const projectIndexArg = process.argv.find((arg) => arg.startsWith("-i="));
	if (projectIndexArg) {
		indexes = projectIndexArg.slice("-i=".length).split(",").map(Number);
	}

	return {
		projectName,
		indexes,
	};
};
