import roofTentIcon from '../assets/roof-tent.svg';
import hitchTentIcon from '../assets/hitch-tent.svg';
import snowSledIcon from '../assets/snow-sled.svg';
import cityBikeIcon from '../assets/city-bike.svg';
import campingTentIcon from '../assets/camping-tent.svg';
import bikeTrailerIcon from '../assets/bike-trailer.svg';
import electricBikeIcon from '../assets/electric-bike.svg';
import gravelBikeIcon from '../assets/gravel-bike.svg';
import bikeAccessoriesIcon from '../assets/bike-accessories.svg';
import mountainGearIcon from '../assets/mountain-gear.svg';
import childCarrierIcon from '../assets/child-carrier.svg';
import touringSkisIcon from '../assets/touring-skis.svg';
import avalancheGearIcon from '../assets/avalanche-gear.svg';
import canoeIcon from '../assets/canoe.svg';
import supBoardIcon from '../assets/sup-board.svg';
import kayakIcon from '../assets/kayak.svg';

const CATEGORIES = [
  { name: 'Namioty dachowe', icon: roofTentIcon },
  { name: 'Namioty na hak', icon: hitchTentIcon },
  { name: 'Sanki śnieżne', icon: snowSledIcon },
  { name: 'Rowery miejskie', icon: cityBikeIcon },
  { name: 'Namioty klasyczne', icon: campingTentIcon },
  { name: 'Przyczepki rowerowe', icon: bikeTrailerIcon },
  { name: 'E-bike full', icon: electricBikeIcon },
  { name: 'Rowery gravel', icon: gravelBikeIcon },
  { name: 'Akcesoria rowerowe', icon: bikeAccessoriesIcon },
  { name: 'Sprzęt górski', icon: mountainGearIcon },
  { name: 'Nosidełka turystyczne', icon: childCarrierIcon },
  { name: 'Narty skiturowe', icon: touringSkisIcon },
  { name: 'Sprzęt lawinowy', icon: avalancheGearIcon },
  { name: 'Kanoo', icon: canoeIcon },
  { name: 'Deski sup', icon: supBoardIcon },
  { name: 'Kajaki', icon: kayakIcon },
];

export default function CategoryBar() {
  return (
    <div className="bg-white border-b border-neutral-200">
      <div className="max-w-[1700px] mx-auto px-4 pt-6 pb-2">
        
        <div className="flex flex-row justify-between items-start overflow-x-auto pb-6">
          
          {CATEGORIES.map((category, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center gap-3 cursor-pointer group min-w-[75px] shrink-0"
            >
              <img 
                src={category.icon} 
                alt={category.name} 
                className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-200"
              />
              <span className="text-[12px] text-center font-medium leading-tight px-2">
                {category.name}
              </span>
            </div>
          ))}
          
        </div>
      </div>
    </div>
  );
}