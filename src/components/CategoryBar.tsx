import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import type { CategoryItem } from '../api/category.ts';
import useCategories from '../features/category/useCategories.ts';
import { getSubcategorySearchPath } from '../features/search/categoryUtils.ts';
import { resolveImageUrl } from '../utils/resolveImageUrl.ts';

type CategoryBarItem = {
  name: string;
  slug: string;
  image?: string | null;
  categorySlug: string;
};

const SCROLL_SPEED_PX_PER_SECOND = 24;

const getCategoryBarItems = (categories: readonly CategoryItem[]): CategoryBarItem[] => {
  const items: CategoryBarItem[] = [];
  const seenSlugs = new Set<string>();

  for (const category of categories) {
    for (const subcategory of category.subcategories) {
      if (seenSlugs.has(subcategory.slug)) continue;

      seenSlugs.add(subcategory.slug);
      items.push({
        name: subcategory.name,
        slug: subcategory.slug,
        image: resolveImageUrl(subcategory.image) || null,
        categorySlug: category.slug,
      });
    }
  }

  return items;
};

function CategoryIcon({ image, name }: { image?: string | null; name: string }) {
  if (!image) {
    return <span aria-hidden="true" className="h-8 w-8 md:h-10 md:w-10" />;
  }

  return (
    <img
      src={image}
      alt=""
      title={name}
      aria-hidden="true"
      className="h-8 w-8 object-contain transition-transform duration-200 group-hover:scale-110 md:h-10 md:w-10"
      draggable={false}
    />
  );
}

function CategoryBarEntry({ item, interactive }: { item: CategoryBarItem; interactive: boolean }) {
  const content = (
    <>
      <CategoryIcon image={item.image} name={item.name} />
      <span className="line-clamp-2 px-1 text-center text-[11px] font-medium leading-[14px] md:px-2 md:text-[12px] md:leading-tight">
        {item.name}
      </span>
    </>
  );

  const className = 'group flex w-16 shrink-0 flex-col items-center gap-2 md:w-[75px] md:gap-3';

  if (!interactive) {
    return <div className={className}>{content}</div>;
  }

  return (
    <Link to={getSubcategorySearchPath(item.categorySlug, item.slug)} className={className}>
      {content}
    </Link>
  );
}

export default function CategoryBar() {
  const { categories, isLoading } = useCategories();
  const items = useMemo(() => getCategoryBarItems(categories), [categories]);
  const viewportRef = useRef<HTMLDivElement>(null);
  const categoryGroupRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [dimensions, setDimensions] = useState({ contentWidth: 0, viewportWidth: 0 });

  useEffect(() => {
    const viewport = viewportRef.current;
    const categoryGroup = categoryGroupRef.current;

    if (!viewport || !categoryGroup || items.length === 0) return;

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
  }, [items]);

  if (!isLoading && items.length === 0) return null;

  const isOverflowing = dimensions.contentWidth > dimensions.viewportWidth + 1;
  const shouldAnimate = isOverflowing && !prefersReducedMotion;
  const groupWidth = isOverflowing ? dimensions.contentWidth : dimensions.viewportWidth;
  const duration = groupWidth / SCROLL_SPEED_PX_PER_SECOND;

  const categoryGroupClassName = `flex h-[68px] shrink-0 items-start md:h-[82px] ${
    isOverflowing ? 'justify-center' : 'justify-between'
  }`;
  const categoryGroupStyle = { width: groupWidth || '100%' };

  return (
    <div className="bg-app-surface border-b border-app-borderSoft select-none">
      <div
        ref={viewportRef}
        className={`w-full pb-2 pt-6 text-app-textNeutral ${
          prefersReducedMotion && isOverflowing ? 'overflow-x-auto' : 'overflow-hidden'
        }`}
      >
        {isLoading && items.length === 0 ? (
          <div
            role="status"
            aria-label="Ładowanie subkategorii"
            className="flex h-[68px] animate-pulse justify-between md:h-[82px]"
          >
            {Array.from({ length: 8 }, (_, index) => (
              <div
                key={index}
                className="flex w-16 shrink-0 flex-col items-center gap-2 md:w-[75px] md:gap-3"
              >
                <span className="h-8 w-8 rounded-full bg-app-borderSoft md:h-10 md:w-10" />
                <span className="h-3 w-12 rounded bg-app-borderSoft" />
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            className="flex w-max min-w-full"
            animate={{ x: shouldAnimate ? -groupWidth : 0 }}
            transition={
              shouldAnimate
                ? { duration, ease: 'linear', repeat: Infinity, repeatType: 'loop' }
                : { duration: 0 }
            }
          >
            <div
              ref={categoryGroupRef}
              className={categoryGroupClassName}
              style={categoryGroupStyle}
            >
              {items.map((item) => (
                <CategoryBarEntry key={item.slug} item={item} interactive />
              ))}
            </div>
            {isOverflowing && (
              <div aria-hidden="true" className={categoryGroupClassName} style={categoryGroupStyle}>
                {items.map((item) => (
                  <CategoryBarEntry key={item.slug} item={item} interactive={false} />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
