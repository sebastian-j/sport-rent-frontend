import ButtonCore from './core/ButtonCore.tsx';

type PanoramicImageProps = {
  image: string;
  title: string;
  onButtonClick: () => void;
};

export function PanoramicImagePlaceholder() {
  return (
    <div
      role="status"
      aria-label="Ładowanie wyróżnionej kategorii"
      className="flex h-[50vh] w-full animate-pulse flex-col items-center justify-center gap-4 bg-app-surfaceNeutral"
    >
      <div className="h-[7vh] w-2/3 max-w-xl rounded-lg bg-app-borderSoft" />
      <div className="h-[6vh] w-48 rounded-lg bg-app-borderSoft" />
    </div>
  );
}

export default function PanoramicImage({ image, title, onButtonClick }: PanoramicImageProps) {
  return (
    <div className="relative flex h-[50vh] w-full flex-col items-center justify-center gap-4 overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center bg-no-repeat dark:brightness-[0.85]"
        style={{ backgroundImage: `url(${image})` }}
      />
      <p className="relative z-10 break-words px-4 text-center text-[7vh] font-bold text-app-textInverted drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
        {title}
      </p>
      <div className="relative z-10">
        <ButtonCore
          text="Rezerwuj teraz"
          onClick={onButtonClick}
          inverted
          className="ps-12 pe-12 p-4 font-bold text-[2vh]"
        />
      </div>
    </div>
  );
}
