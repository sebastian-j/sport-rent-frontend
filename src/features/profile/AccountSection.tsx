import { useState } from 'react';
import Switch from '../../components/core/Switch.tsx';
import EmailForm from './account/EmailForm.tsx';
import PasswordForm from './account/PasswordForm.tsx';
import PersonalDataForm, { type PersonalData } from './account/PersonalDataForm.tsx';
import SettingsCard from './account/SettingsCard.tsx';

type Section = 'personal' | 'email' | 'password' | null;

const INITIAL_PERSONAL_DATA: PersonalData = {
  firstName: 'Jan',
  lastName: 'Kowalski',
  country: 'Polska',
  city: 'Kraków',
  addressLine1: 'ul. Kałuży 1',
  addressLine2: '',
  postalCode: '30-111',
};

export default function AccountSection() {
  const [expandedSection, setExpandedSection] = useState<Section>(null);
  const [newsletter, setNewsletter] = useState(true);
  const [personalData, setPersonalData] = useState(INITIAL_PERSONAL_DATA);
  const [currentEmail, setCurrentEmail] = useState('jankowalski@gmail.com');

  const toggleSection = (section: Exclude<Section, null>) => {
    setExpandedSection((currentSection) => (currentSection === section ? null : section));
  };

  const closeSection = () => setExpandedSection(null);

  const savePersonalData = (data: PersonalData) => {
    setPersonalData(data);
    alert('Dane osobowe zostały pomyślnie zapisane!');
    closeSection();
  };

  const saveEmail = (email: string) => {
    setCurrentEmail(email);
    alert('Adres e-mail został zmieniony!');
    closeSection();
  };

  const savePassword = () => {
    alert('Hasło zostało zaktualizowane!');
    closeSection();
  };

  return (
    <div className="flex flex-col items-center w-full pt-6 text-app-text md:pt-12">
      <h2 className="text-5xl text-center text-3xl md:text-5xl">Ustawienia konta</h2>

      <div className="my-6 flex w-full flex-col gap-0.5 overflow-hidden rounded-xl bg-app-borderSoft md:m-12 md:max-w-[calc(100%-6rem)]">
        <SettingsCard
          title="Dane osobowe i adres"
          subtitle={`${personalData.firstName} ${personalData.lastName}, ${personalData.city}`}
          isExpanded={expandedSection === 'personal'}
          scrollOnCollapse={expandedSection === null}
          onToggle={() => toggleSection('personal')}
        >
          <PersonalDataForm
            initialData={personalData}
            onSave={savePersonalData}
            onCancel={closeSection}
          />
        </SettingsCard>

        <SettingsCard
          title="Adres e-mail"
          subtitle={currentEmail}
          isExpanded={expandedSection === 'email'}
          scrollOnCollapse={expandedSection === null}
          onToggle={() => toggleSection('email')}
        >
          <EmailForm currentEmail={currentEmail} onSave={saveEmail} onCancel={closeSection} />
        </SettingsCard>

        <SettingsCard
          title="Hasło"
          subtitle="••••••••"
          isExpanded={expandedSection === 'password'}
          scrollOnCollapse={expandedSection === null}
          onToggle={() => toggleSection('password')}
        >
          <PasswordForm onSave={savePassword} onCancel={closeSection} />
        </SettingsCard>

        <div className="flex select-none items-center justify-between gap-4 bg-app-surfaceElevated p-4 md:p-6">
          <div>
            <h2 className="text-lg font-bold">Newsletter</h2>
            <p className="mt-1 text-sm text-app-textMuted">Otrzymuj informacje o promocjach</p>
          </div>
          <Switch ariaLabel="Newsletter" checked={newsletter} onCheckedChange={setNewsletter} />
        </div>
      </div>
    </div>
  );
}
