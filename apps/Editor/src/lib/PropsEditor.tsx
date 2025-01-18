import { useState } from "react";

export interface PropsOptions {
  [key: string]:
    | PropsOptionBoolean
    | PropsOptionString
    | PropsOptionNumber
    | PropsOptionArray;
}

interface PropsOptionBoolean {
  type: "boolean";
  default?: boolean;
}

interface PropsOptionString {
  type: "string";
  default?: string;
}

interface PropsOptionNumber {
  type: "number";
  default?: number;
}

interface PropsOptionArray {
  type: string[];
  default?: string;
}

interface PropsState {
  [key: string]: boolean | string | number;
}

function buildStateFromPropsOptions(propsOptions: PropsOptions) {
  const state: PropsState = {};
  for (const key in propsOptions) {
    let value = propsOptions[key].default;
    if (value === undefined) {
      if (propsOptions[key].type === "boolean") value = false;
      else if (propsOptions[key].type === "number") value = 0;
      else if (propsOptions[key].type === "string") value = "";
      else if (Array.isArray(propsOptions[key].type))
        value = propsOptions[key].type[0];
      else continue;
    }
    state[key] = value;
  }
  return state;
}

export function PropsEditor({
  propsList,
  props,
  setProps,
}: {
  propsList: PropsOptions;
  props: PropsState;
  setProps: (props: PropsState) => void;
}) {
  return (
    <div>
      <button onClick={() => setProps(buildStateFromPropsOptions(propsList))}>
        Reset
      </button>
      {Object.entries(props).map(([key, value]) => {
        const type = propsList[key].type;
        return (
          <div key={key} className="flex gap-4">
            <p>{key}</p>
            {type === "boolean" && (
              <input
                type="checkbox"
                checked={value as boolean}
                onChange={(e) =>
                  setProps({ ...props, [key]: e.target.checked })
                }
              />
            )}
            {type === "number" && (
              <input
                type="number"
                value={value as number}
                onChange={(e) =>
                  setProps({ ...props, [key]: parseInt(e.target.value) })
                }
              />
            )}
            {type === "string" && (
              <input
                type="text"
                value={value as string}
                onChange={(e) => setProps({ ...props, [key]: e.target.value })}
              />
            )}
            {Array.isArray(type) && (
              <select
                value={value as string}
                onChange={(e) => setProps({ ...props, [key]: e.target.value })}
              >
                {type.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function usePropsEditor(propsList: PropsOptions): [JSX.Element, PropsState] {
  const [props, setProps] = useState(buildStateFromPropsOptions(propsList));
  const Component = (
    <PropsEditor propsList={propsList} props={props} setProps={setProps} />
  );
  return [Component, props];
}
