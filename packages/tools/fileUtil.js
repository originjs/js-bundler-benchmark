import { rmSync } from "fs";
import { join } from "path";
import { rm } from "fs/promises";
import { runtimeInfo } from "./projectInfo.js";

export function forceRm(dir) {
	return rmSync(dir, {
		force: true,
		recursive: true,
		maxRetries: 5,
	});
}

export const sleep = async (ms) => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};
