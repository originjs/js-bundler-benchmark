import { platform as _platform } from "os";
import axios from "axios";

const techStack = "buildTools";
const url = process.env.REPORT_URL;

export async function report(jsonData) {
	const { data: patchId } = await axios.post(
		`${url}/sync/benchmark/getPatchId`,
		{},
	);
	console.log("patchId: ", patchId);
	const res = dealdata(jsonData, patchId.toString());
	await postData(res);
}

function dealdata(jsonData, patchId) {
	const res = [];
	for (const result of jsonData) {
		const props = Object.keys(result);
		const values = Object.values(result);
		values.splice(props.indexOf("bundler"), 1);
		values.splice(props.indexOf("projectName"), 1);
		const filteredProps = props.filter(
			(el) => el !== "bundler" && el !== "projectName",
		);

		for (const prop of filteredProps) {
			res.push({
				projectName: result.projectName,
				benchmark: `${result.bundler}_${prop}`,
				techStack,
				rawValue:
					values[filteredProps.indexOf(prop)] === "skipped"
						? -1
						: values[filteredProps.indexOf(prop)],
				content: result,
				patchId,
				platform: _platform(),
			});
		}
	}
	return res;
}

async function postData(res) {
	for (const data of res) {
		try {
			console.log(data);
			const response = await axios.post(`${url}/sync/benchmark`, data);
			console.log(response.data);
		} catch (error) {
			console.error(error);
		}
	}
}
