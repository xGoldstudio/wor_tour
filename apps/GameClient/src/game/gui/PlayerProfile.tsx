import { getImageUrl, ICONS } from "@repo/lib";

export default function PlayerProfile() {
  return (
    <div className="max-lg:pl-3 pt-3 flex gap-2 items-center">
      <div className="w-12 h-12 bg-slate-600 rounded-sm overflow-hidden">
        <img
          src={getImageUrl(ICONS, "default_profile_picture.png")}
          className="w-full h-full"
        />
      </div>
      <div className="flex flex-col">
        <p className="font-semibold text-slate-900">Goldaxe</p>
        <div className="flex gap-0.5 items-center font-semibold text-sm relative right-1 text-slate-700">
          <img
            id="trophyCountIcon"
            src={getImageUrl(ICONS, "trophy.png")}
            className="w-[20px] h-auto drop-shadow-[2px_1px_1px_black]"
          />
          <p>1930</p>
        </div>
      </div>
    </div>
  );
}
