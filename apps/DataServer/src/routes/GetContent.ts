import { AppState } from "../appStore";

export default function GetContentHandler(state: AppState) {
	return function handler() {
		return state.content;
	}
}