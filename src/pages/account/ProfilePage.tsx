import ProfileCard from '../../features/profile/ProfileCard.tsx';
import { Gem, ShoppingBag, User } from 'lucide-react';
import { type ComponentType, useEffect, useRef, useState } from 'react';
import AccountSection from '../../features/profile/AccountSection.tsx';
import LoyaltySection from '../../features/profile/LoyaltySection.tsx';
import OrdersSection from '../../features/profile/OrdersSection.tsx';
import ContentPanel from '../../components/core/ContentPanel.tsx';
import { scrollElementIntoViewIfBelow } from '../../utils/scrollElementIntoViewIfBelow.ts';

type ProfileSection = 'account' | 'loyalty' | 'orders';

const SECTION_COMPONENTS: Record<ProfileSection, ComponentType> = {
  account: AccountSection,
  loyalty: LoyaltySection,
  orders: OrdersSection,
};

export default function ProfilePage() {
  const [selectedSection, setSelectedSection] = useState<ProfileSection>('account');
  const previousSectionRef = useRef(selectedSection);
  const sectionContentRef = useRef<HTMLDivElement>(null);
  const SelectedSection = SECTION_COMPONENTS[selectedSection];

  useEffect(() => {
    if (previousSectionRef.current === selectedSection) return;

    previousSectionRef.current = selectedSection;
    const sectionContent = sectionContentRef.current;
    if (!sectionContent) return;

    return scrollElementIntoViewIfBelow(sectionContent);
  }, [selectedSection]);

  return (
    <div className="mx-auto flex w-full max-w-[100rem] flex-col">
      <p className="mt-6 px-4 text-center text-3xl font-semibold text-app-text min-[961px]:mt-12 min-[961px]:text-5xl">
        Jan Kowalski
      </p>

      <div className="my-6 flex flex-col gap-4 px-4 min-[961px]:my-12 min-[961px]:flex-row min-[961px]:gap-16 min-[961px]:px-16">
        <nav
          aria-label="Sekcje profilu"
          className="sticky top-12 z-40 -mx-4 flex h-fit w-[calc(100%+2rem)] flex-row gap-0.5 self-start rounded-none bg-app-surface px-4 py-2 text-app-textInverted [&>*:first-child]:rounded-l-xl [&>*:last-child]:rounded-r-xl min-[961px]:top-16 min-[961px]:mx-0 min-[961px]:w-auto min-[961px]:flex-col min-[961px]:rounded-xl min-[961px]:bg-transparent min-[961px]:px-0 min-[961px]:py-0 min-[961px]:[&>*:first-child]:rounded-bl-none min-[961px]:[&>*:first-child]:rounded-tr-xl min-[961px]:[&>*:last-child]:rounded-bl-xl min-[961px]:[&>*:last-child]:rounded-tr-none"
        >
          <ProfileCard
            title="Ustawienia konta"
            icon={User}
            selected={selectedSection === 'account'}
            onClick={() => setSelectedSection('account')}
          />
          <ProfileCard
            title="Program lojalnościowy"
            icon={Gem}
            selected={selectedSection === 'loyalty'}
            onClick={() => setSelectedSection('loyalty')}
          />
          <ProfileCard
            title="Historia zamówień"
            icon={ShoppingBag}
            selected={selectedSection === 'orders'}
            onClick={() => setSelectedSection('orders')}
          />
        </nav>
        <ContentPanel
          ref={sectionContentRef}
          className="w-full flex-none scroll-mt-36 items-stretch p-4 min-[961px]:flex-[2] min-[961px]:scroll-mt-16 min-[961px]:p-8"
        >
          <SelectedSection />
        </ContentPanel>
      </div>
    </div>
  );
}
