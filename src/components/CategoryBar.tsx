import roofTentIcon from '../assets/categories/roof-tent.svg';
import hitchTentIcon from '../assets/categories/hitch-tent.svg';
import snowSledIcon from '../assets/categories/snow-sled.svg';
import cityBikeIcon from '../assets/categories/city-bike.svg';
import campingTentIcon from '../assets/categories/camping-tent.svg';
import bikeTrailerIcon from '../assets/categories/bike-trailer.svg';
import electricBikeIcon from '../assets/categories/electric-bike.svg';
import gravelBikeIcon from '../assets/categories/gravel-bike.svg';
import bikeAccessoriesIcon from '../assets/categories/bike-accessories.svg';
import mountainGearIcon from '../assets/categories/mountain-gear.svg';
import childCarrierIcon from '../assets/categories/child-carrier.svg';
import touringSkisIcon from '../assets/categories/touring-skis.svg';
import avalancheGearIcon from '../assets/categories/avalanche-gear.svg';
import canoeIcon from '../assets/categories/canoe.svg';
import supBoardIcon from '../assets/categories/sup-board.svg';
import kayakIcon from '../assets/categories/kayak.svg';

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