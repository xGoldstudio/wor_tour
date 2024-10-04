import { Borders, CardIllustartion, InnerBord, textureByRarity } from "@repo/ui";

interface FieldProps {
  children: React.ReactNode;
	width?: number;
}

export default function Field({ children, width = 191 }: FieldProps) {
  return (
    <Borders width={width} height={55} borderUnit={1} rarity={"epic"}>
      <CardIllustartion width={width} height={55} borderUnit={0.6}>
        <InnerBord size={1}>
          <div className="flex w-full items-center justify-start pl-2 gap-2 relative bg-slate-600 h-full">
            <div
              className="absolute top-0 left-0 w-full h-full blur-sm"
              style={{ backgroundImage: `url(${textureByRarity("rare")})` }}
            />
            {children}
          </div>
        </InnerBord>
      </CardIllustartion>
    </Borders>
  );
}
