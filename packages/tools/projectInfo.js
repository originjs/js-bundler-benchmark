import { fileURLToPath } from "node:url";
import { resolve } from "path";

const map = new Map();
const triangleReact = {
	dirname: "triangle-react",
	rootFilePath: "src/comps/triangle.jsx",
	leafFilePath: "src/comps/triangle_1_1_2_1_2_2_1.jsx",
};
const triangleVue = {
	dirname: "triangle-vue",
	rootFilePath: "src/components/triangle.vue",
	leafFilePath: "src/components/triangle_1_1_2_1_2_2_1.vue",
};
map.set(triangleReact.dirname, triangleReact);
map.set(triangleVue.dirname, triangleVue);

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
