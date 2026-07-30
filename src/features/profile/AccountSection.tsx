import { useEffect, useState } from 'react';

import { getUser, updateAddress } from '../../api/user.ts';
import Switch from '../../components/core/Switch.tsx';
import EmailForm from './account/EmailForm.tsx';
import PasswordForm from './account/PasswordForm.tsx';
import PersonalDataForm, { type PersonalData } from './account/PersonalDataForm.tsx';
import SettingsCard from './account/SettingsCard.tsx';

type Section = 'personal' | 'email' | 'password' | null;

export default function AccountSection() {
  const [expandedSection, setExpandedSection] = useState<Section>(null);
  const [newsletter, setNewsletter] = useState(true);
  const [personalData, setPersonalData] = useState<PersonalData | null>(null);
  const [currentEmail, setCurrentEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getUser().then(({ data }) => {
      if (data) {
        setPersonalData({
          firstName: data.first_name,
          lastName: data.last_name,
          country: data.country,
          city: data.city,
          addressLine1: data.first_line,
          addressLine2: data.second_line ?? '',
          postalCode: data.postal_code,
        });
        setCurrentEmail(data.email);
      }
    });
  }, []);

  const toggleSection = (section: Exclude<Section, null>) => {
    setError(null);
    setExpandedSection((currentSection) => (currentSection === section ? null : section));
  };

  const closeSection = () => {
    setError(null);
    setExpandedSection(null);
  };

  const savePersonalData = async (data: PersonalData) => {
    setError(null);
    try {
      const { error } = await updateAddress(data);
      if (error) {
        setError(
          (error as any)?.detail?.[0]?.msg ||
            (error as any)?.detail ||
            'Wystąpił nieznany błąd zapisu.'
        );
        console.error(error);
        return;
      }

      setPersonalData(data);
      alert('Dane osobowe zostały pomyślnie zapisane w bazie!');
      closeSection();
    } catch (error) {
      setError((error as any)?.message || 'Wystąpił błąd połączenia z serwerem.');
      console.error(error);
    }
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

  if (!personalData) {
    return <div className="w-full pt-12 text-center text-app-text">Ładowanie ustawień...</div>;
  }

  return (
    <div className="flex flex-col items-center w-full pt-6 text-app-text md:pt-12">
      <h2 className="text-5xl text-center text-3xl md:text-5xl">Ustawienia konta</h2>

      <div className="my-6 flex w-full flex-col gap-0.5 overflow-hidden rounded-xl bg-app-borderSoft md:m-12 md:max-w-[calc(100%-6rem)]">
        {error && (
          <div className="flex w-full flex-col items-center justify-center bg-red-100/10 p-4 text-center text-red-500">
            <p className="font-medium">{error}</p>
          </div>
        )}

        <SettingsCard
          title="Dane osobowe i adres"
          subtitle={`${personalData.firstName} ${personalData.lastName}, ${personalData.city}`}
          isExpanded={expandedSection === 'personal'}
          scrollOnCollapse={expandedSection === null}
          onToggle={() => toggleSection('personal')}
        >
          <PersonalDataForm
            initialData={personalData}
            onSave={(data) => void savePersonalData(data)}
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
