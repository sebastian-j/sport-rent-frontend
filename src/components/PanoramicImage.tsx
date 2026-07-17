import ButtonCore from './core/ButtonCore.tsx';

type PanoramicImageProps = {
  image: string;
  title: string;
};

export default function PanoramicImage({ image, title }: PanoramicImageProps) {
  return (
    <div className="relative flex h-[50vh] w-full flex-col items-center justify-center gap-4 overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center bg-no-repeat dark:brightness-[0.85]"
        style={{ backgroundImage: `url(${image})` }}
      />
      <p className="relative z-10 text-[7vh] font-bold text-app-textInverted">{title}</p>
      <div className="relative z-10">
        <ButtonCore
          text="Rezerwuj teraz"
          onClick={() => {}}
          inverted
          className="ps-12 pe-12 p-4 font-bold text-[2vh]"
        />
      </div>
    </div>
  );
}
