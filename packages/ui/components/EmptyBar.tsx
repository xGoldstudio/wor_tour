export default function EmptyBar({ children }: { children?: React.ReactNode }) {
  return (
    <div className="w-full h-full left-0 bg-gradient-to-b  from-[rgb(88,88,89)] via-[rgb(177,177,178)] via-[37%] to-[rgb(88,88,80)] shadow-md relative">
      {children}
    </div>
  );
}
