import { fileURLToPath } from "node:url";
import { resolve } from "path";

const map = new Map();
const triangleReact = {
	dirname: "triangle-react",
	rootFilePath: "src/comps/triangle.jsx",
	leafFilePath: "src/comps/triangle_1_1_2_1_2_2_1.jsx",
};
map.set(triangleReact.dirname, triangleReact);

const projectsDirname = resolve(
	fileURLToPath(import.meta.url),
	"../../projects",
);

const runtimeInfo = {
	currentDir: "",
};

export const getProjectInfo = (dirname) => {
	return map.get(dirname);
};

export { projectsDirname, runtimeInfo };
