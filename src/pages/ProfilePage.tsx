import ProfileCard from '../features/profile/ProfileCard.tsx';
import { Gem, ShoppingBag, User } from 'lucide-react';
import { type ComponentType, useState } from 'react';
import AccountSection from '../features/profile/AccountSection.tsx';
import LoyaltySection from '../features/profile/LoyaltySection.tsx';
import OrdersSection from '../features/profile/OrdersSection.tsx';
import ContentPanel from '../components/core/ContentPanel.tsx';

type ProfileSection = 'account' | 'loyalty' | 'orders';

const SECTION_COMPONENTS: Record<ProfileSection, ComponentType> = {
  account: AccountSection,
  loyalty: LoyaltySection,
  orders: OrdersSection,
};

export default function ProfilePage() {
  const [selectedSection, setSelectedSection] = useState<ProfileSection>('account');
  const SelectedSection = SECTION_COMPONENTS[selectedSection];

  return (
    <div className="mx-auto flex w-full max-w-[100rem] flex-col">
      <p className="mt-12 text-center text-5xl font-semibold text-app-text">Jan Kowalski</p>

      <div className="my-12 flex flex-row gap-16 px-16">
        <div className="flex flex-col gap-0.5 rounded-xl text-app-textInverted [&>*:first-child]:rounded-t-xl [&>*:last-child]:rounded-b-xl">
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
        </div>
        <ContentPanel className="flex-[2] items-stretch">
          <SelectedSection />
        </ContentPanel>
      </div>
    </div>
  );
}
