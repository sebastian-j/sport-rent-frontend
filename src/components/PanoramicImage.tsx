import ButtonCore from "./core/ButtonCore.tsx";

type PanoramicImageProps = {
  image: string;
  title: string;
};

export default function PanoramicImage({ image, title }: PanoramicImageProps) {
  return (
    <div
      className="w-full h-[50vh] bg-cover bg-center bg-no-repeat flex flex-col justify-center items-center gap-4"
      style={{ backgroundImage: `url(${image})` }}
    >
      <p className="text-white text-8xl font-bold ">{title}</p>
      <div className="">
        <ButtonCore text="Rezerwuj teraz" onClick={() => {}} inverted className="ps-12 pe-12 p-4 font-bold"/>
      </div>

    </div>
  );
}
