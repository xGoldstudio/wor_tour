export function preventDefault<Event extends { preventDefault: () => void }>(
  cb: (e: Event) => void | (() => void),
) {
  return (e: Event) => {
    e.preventDefault();
    cb(e);
  };
}

export function stopPropagation<Event extends { stopPropagation: () => void }>(
  cb: (e: Event) => void | (() => void),
) {
  return (e: Event) => {
    e.stopPropagation();
    cb(e);
  };
}
