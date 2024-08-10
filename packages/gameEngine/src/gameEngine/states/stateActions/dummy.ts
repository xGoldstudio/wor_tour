import { AddedStateAction, ChangeValueStateAction, RemovedStateAction, StateAction } from "../CardStatesData";

const DummyStateAction: StateAction = () => {
}

const OnAddedDummyStateAction: AddedStateAction = () => {
}

const OnRemovedDummyStateAction: RemovedStateAction = () => {
}

const OnChangeValueDummyStateAction: ChangeValueStateAction = () => {
}

export default DummyStateAction;
export {
	OnAddedDummyStateAction,
	OnRemovedDummyStateAction,
	OnChangeValueDummyStateAction,
};