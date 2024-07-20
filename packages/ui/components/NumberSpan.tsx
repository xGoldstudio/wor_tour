import { numberWithCommas } from "@repo/lib";

export default function NumberSpan({ children }: { children: number }) {
  return <span>{numberWithCommas(children)}</span>;
}