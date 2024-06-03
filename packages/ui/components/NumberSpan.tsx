import { numberWithCommas } from "../lib/utils";

export default function NumberSpan({ children }: { children: number }) {
  return <span>{numberWithCommas(children)}</span>;
}