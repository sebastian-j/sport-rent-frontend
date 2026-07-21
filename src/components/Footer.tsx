import { ChevronDown } from 'lucide-react';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { SocialIcon } from 'react-social-icons/component';
import 'react-social-icons/facebook';
import 'react-social-icons/instagram';
import 'react-social-icons/tiktok';
import 'react-social-icons/twitter';
import footerLogo from '../assets/logo_footer.svg';

type FooterSectionProps = {
  children: ReactNode;
  id: string;
  title: string;
};

function FooterSection({ children, id, title }: FooterSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const animationDuration = prefersReducedMotion ? 0 : 500;
    const animationStart = performance.now();
    let animationFrame = 0;

    const followExpandedSection = () => {
      const sectionBottom = sectionRef.current?.getBoundingClientRect().bottom;
      const viewportPadding = 24;

      if (sectionBottom && sectionBottom > window.innerHeight - viewportPadding) {
        window.scrollBy({
          top: sectionBottom - window.innerHeight + viewportPadding,
          behavior: 'auto',
        });
      }

      if (performance.now() - animationStart < animationDuration) {
        animationFrame = requestAnimationFrame(followExpandedSection);
      }
    };

    animationFrame = requestAnimationFrame(followExpandedSection);

    return () => cancelAnimationFrame(animationFrame);
  }, [isOpen]);

  return (
    <section
      ref={sectionRef}
      className="border-t border-white/20 text-center lg:border-0 lg:text-left"
    >
      <button
        type="button"
        className="relative flex w-full items-center justify-center py-4 text-center text-lg font-bold lg:hidden"
        aria-controls={id}
        aria-expanded={isOpen}
        onClick={() => {
          setShouldAnimate(true);
          setIsOpen((previous) => !previous);
        }}
      >
        {title}
        <ChevronDown
          aria-hidden="true"
          className={`absolute right-0 transition-transform duration-500 motion-reduce:transition-none ${isOpen ? 'rotate-180' : ''}`}
          size={22}
        />
      </button>

      <h2 className="hidden pb-3 text-2xl font-bold lg:block">{title}</h2>
      <div
        id={id}
        className={`grid motion-reduce:transition-none lg:grid-rows-[1fr] lg:opacity-100 lg:transition-none ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        } ${
          shouldAnimate
            ? 'transition-[grid-template-rows,opacity] duration-500 ease-in-out'
            : 'transition-none'
        }`}
      >
        <div className="min-h-0 overflow-hidden">{children}</div>
      </div>
    </section>
  );
}

export default function Footer() {
  return (
    <footer className="bg-black px-5 py-10 text-app-textInverted sm:px-8 md:px-12 md:py-14 lg:px-20">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-0 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)] lg:gap-x-16">
        <div className="mb-8 flex max-w-xl justify-self-center flex-col items-center gap-5 text-center lg:mb-0">
          <img className="h-auto w-64 max-w-full" src={footerLogo} alt="Logo Polar Sport Rent" />
          <p className="text-base leading-relaxed text-app-textInvertedMuted lg:text-lg">
            Polar Sport Rent - wypożyczalnia sprzętu outdoorowego dla aktywnych. W naszej ofercie
            znajdziesz wszystko, czego potrzebujesz do przygód w terenie: rowery gravelowe, deski
            SUP, namioty dachowe, przyczepki rowerowe, sprzęt wspinaczkowy oraz narty skiturowe.
            Wypożycz i ruszaj po przygodę - latem i zimą!
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <SocialIcon
              url="https://www.twitter.com"
              bgColor="black"
              style={{ height: 44, width: 44 }}
            />
            <SocialIcon
              url="https://www.facebook.com"
              bgColor="black"
              style={{ height: 44, width: 44 }}
            />
            <SocialIcon
              url="https://www.tiktok.com"
              bgColor="black"
              style={{ height: 44, width: 44 }}
            />
            <SocialIcon
              url="https://www.instagram.com"
              bgColor="black"
              style={{ height: 44, width: 44 }}
            />
          </div>
        </div>

        <div className="border-b border-white/20 lg:border-0">
          <FooterSection id="footer-information" title="Informacje">
            <ul className="space-y-3 pb-4 text-base text-app-textInvertedMuted [&_a:hover]:text-app-textInverted lg:pb-0 lg:text-lg">
              <li>
                <Link to="/about">O nas</Link>
              </li>
              <li>
                <Link to="/contact">Kontakt</Link>
              </li>
              <li>
                <Link to="/points">Program lojalnościowy</Link>
              </li>
              <li>
                <Link to="/tos" target="_blank">
                  Regulamin
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" target="_blank">
                  Polityka prywatności RODO
                </Link>
              </li>
              <li>
                <Link to="/faq">FAQ</Link>
              </li>
            </ul>
          </FooterSection>
        </div>

        <div className="border-b border-white/20 lg:border-0">
          <FooterSection id="footer-contact" title="Polar Sport Rent">
            <address className="pb-4 not-italic lg:pb-0">
              <ul className="space-y-3 text-base text-app-textInvertedMuted [&_a:hover]:text-app-textInverted lg:text-lg">
                <li>ul. Kałuży 1, Kraków</li>
                <li>
                  <a href="tel:+48798798798">798 798 798</a>
                </li>
                <li>
                  <a className="break-words" href="mailto:kontakt@psrent.pl">
                    kontakt@psrent.pl
                  </a>
                </li>
                <li>Godziny otwarcia:</li>
                <li>Pn-Pt 10-20</li>
                <li>Sb-Nd 11-18</li>
              </ul>
            </address>
          </FooterSection>
        </div>
      </div>
    </footer>
  );
}
