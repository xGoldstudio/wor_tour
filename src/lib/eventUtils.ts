export function preventDefault<Event extends { preventDefault: () => void }>(
  cb: (e: Event) => void | (() => void)
) {
  return (e: Event) => {
    e.preventDefault();
    cb(e);
  };
}
