import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
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

const SCROLL_SPEED_PX_PER_SECOND = 24;

export default function CategoryBar() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const categoryGroupRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [dimensions, setDimensions] = useState({ contentWidth: 0, viewportWidth: 0 });

  useEffect(() => {
    const viewport = viewportRef.current;
    const categoryGroup = categoryGroupRef.current;

    if (!viewport || !categoryGroup) return;

    const updateDimensions = () => {
      const contentWidth = Array.from(categoryGroup.children).reduce(
        (width, category) => width + category.getBoundingClientRect().width,
        0
      );

      setDimensions({
        contentWidth,
        viewportWidth: viewport.getBoundingClientRect().width,
      });
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(viewport);
    Array.from(categoryGroup.children).forEach((category) => resizeObserver.observe(category));

    return () => resizeObserver.disconnect();
  }, []);

  const isOverflowing = dimensions.contentWidth > dimensions.viewportWidth + 1;
  const shouldAnimate = isOverflowing && !prefersReducedMotion;
  const groupWidth = isOverflowing ? dimensions.contentWidth : dimensions.viewportWidth;
  const duration = groupWidth / SCROLL_SPEED_PX_PER_SECOND;

  const categoryGroupClassName = `flex h-[68px] shrink-0 items-start min-[961px]:h-[82px] ${
    isOverflowing ? 'justify-center' : 'justify-between'
  }`;
  const categoryGroupStyle = { width: groupWidth || '100%' };
  const categoryItems = CATEGORIES.map((category) => (
    <div
      key={category.name}
      className="group flex w-16 shrink-0 cursor-pointer flex-col items-center gap-2 min-[961px]:w-[75px] min-[961px]:gap-3"
    >
      <span
        aria-hidden="true"
        className="h-8 w-8 bg-app-textNeutral transition-transform duration-200 group-hover:scale-110 min-[961px]:h-10 min-[961px]:w-10"
        style={{
          WebkitMaskImage: `url(${category.icon})`,
          maskImage: `url(${category.icon})`,
          WebkitMaskPosition: 'center',
          maskPosition: 'center',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
          WebkitMaskSize: 'contain',
          maskSize: 'contain',
        }}
      />
      <span className="line-clamp-2 px-1 text-center text-[11px] font-medium leading-[14px] min-[961px]:px-2 min-[961px]:text-[12px] min-[961px]:leading-tight">
        {category.name}
      </span>
    </div>
  ));

  return (
    <div className="bg-app-surface border-b border-app-borderSoft select-none">
      <div
        ref={viewportRef}
        className={`w-full pb-2 pt-6 text-app-textNeutral ${
          prefersReducedMotion && isOverflowing ? 'overflow-x-auto' : 'overflow-hidden'
        }`}
      >
        <motion.div
          className="flex w-max min-w-full"
          animate={{ x: shouldAnimate ? -groupWidth : 0 }}
          transition={
            shouldAnimate
              ? { duration, ease: 'linear', repeat: Infinity, repeatType: 'loop' }
              : { duration: 0 }
          }
        >
          <div ref={categoryGroupRef} className={categoryGroupClassName} style={categoryGroupStyle}>
            {categoryItems}
          </div>
          {isOverflowing && (
            <div aria-hidden="true" className={categoryGroupClassName} style={categoryGroupStyle}>
              {categoryItems}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
