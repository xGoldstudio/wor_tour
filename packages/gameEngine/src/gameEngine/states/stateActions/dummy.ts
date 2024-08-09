import { AddedStateAction, RemovedStateAction, StateAction } from "../CardStatesData";

const DummyStateAction: StateAction = () => {
}

const OnAddedDummyStateAction: AddedStateAction = () => {
}

const OnRemovedDummyStateAction: RemovedStateAction = () => {
}

export default DummyStateAction;
export {
	OnAddedDummyStateAction,
	OnRemovedDummyStateAction
};