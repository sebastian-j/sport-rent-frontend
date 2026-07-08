import ProfileCard from '../components/profile/ProfileCard.tsx';
import { Gem, ShoppingBag, User } from 'lucide-react';
import { type ComponentType, useState } from 'react';
import AccountSection from '../components/profile/AccountSection.tsx';
import LoyaltySection from '../components/profile/LoyaltySection.tsx';
import OrdersSection from '../components/profile/OrdersSection.tsx';

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
      <p className="text-center mt-12 font-semibold text-5xl text-slate-950">Jan Kowalski</p>

      <div className="flex flex-row px-16 my-12 gap-16">
        <div className="flex flex-col gap-0.5 rounded-xl text-white [&>*:first-child]:rounded-t-xl [&>*:last-child]:rounded-b-xl">
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
        <div className="flex-[2] bg-slate-200 rounded-lg border-[1px] border-black">
          <SelectedSection />
        </div>
      </div>
    </div>
  );
}
