export interface AppState {
	content: string;
	updateContent: (content: string) => void;
}

interface AppStoreProps {
	content: string;
}

export default function appStore({ content }: AppStoreProps) {
	const state: AppState = {
		content,
		updateContent,
	};
	function updateContent(content: string) {
		state.content = content;
	}
	return state;
}