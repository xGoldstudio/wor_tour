import { AppState } from "../appStore";

export default function GetContentHandler(state: AppState) {
	return function handler() {
		return JSON.stringify(state.content);
	}
}