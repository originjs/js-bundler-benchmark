import { join } from "path";
import { rm } from "fs/promises";
import { runtimeInfo } from "./projectInfo.js";

export async function forceRm(dir) {
	return rm(join(runtimeInfo.currentDir, dir), {
		force: true,
		recursive: true,
		maxRetries: 5,
	});
}
