interface RewardBoxProps {
  children: React.ReactNode;
  amount: number;
}

export default function RewardBox({ children, amount }: RewardBoxProps) {
  return (
    <div className="w-[100px] h-[100px] flex justify-center items-center rounded-sm relative overflow-hidden border-4 border-yellow-500">
      <div className="w-full h-full bg-yellow-300 opacity-50 absolute" />
      <div className="absolute w-full h-full flex flex-col justify-center items-center">
        <div className="relative bottom-1">{children}</div>
        <div className="absolute bottom-2 z-10 px-2 rounded-md overflow-hidden">
          <div className="absolute bg-slate-100 w-full h-full left-0"></div>
          <p className="relative">x{amount}</p>
        </div>
      </div>
    </div>
  );
}
