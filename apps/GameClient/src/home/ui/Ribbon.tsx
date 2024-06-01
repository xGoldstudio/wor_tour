interface RibbonProps {
  children: string;
}

export default function Ribbon({ children }: RibbonProps) {
  return (
    <div className="w-full flex justify-center relative mb-6 mt-4">
      <img src="/ribbon.png" className="h-[75px] w-[650px]" />
      <p className="absolute top-[35px] text-xl font-stylised w-full text-center text-slate-800">
        {children}
      </p>
    </div>
  );
}
