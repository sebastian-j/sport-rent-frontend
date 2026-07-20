import { useEffect, useRef, useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { scrollElementIntoViewIfBelow } from '../../utils/scrollElementIntoViewIfBelow.ts';
import Switch from '../../components/core/Switch.tsx';

type Section = 'personal' | 'email' | 'password' | null;

type SettingsCardProps = {
  title: string;
  subtitle: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
};

function SettingsCard({ title, subtitle, isExpanded, onToggle, children }: SettingsCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isExpanded || !cardRef.current) return;

    return scrollElementIntoViewIfBelow(cardRef.current);
  }, [isExpanded]);

  return (
    <div ref={cardRef} className="scroll-mt-36 bg-app-surfaceElevated min-[961px]:scroll-mt-16">
      <div
        className="flex cursor-pointer select-none items-center justify-between gap-4 p-4 transition-colors [@media(hover:hover)]:hover:bg-app-surfaceSoft/50 min-[961px]:p-6"
        onClick={onToggle}
      >
        <div>
          <h2 className="text-lg font-bold">{title}</h2>
          <p className="mt-1 text-sm text-app-textMuted">{subtitle}</p>
        </div>
        {isExpanded ? (
          <ChevronDown className="text-app-textMuted" />
        ) : (
          <ChevronRight className="text-app-textMuted" />
        )}
      </div>
      {isExpanded && (
        <div className="border-t border-app-borderSoft p-4 pt-0 min-[961px]:p-6 min-[961px]:pt-0">
          {children}
        </div>
      )}
    </div>
  );
}

export default function AccountSection() {
  const [expandedSection, setExpandedSection] = useState<Section>(null);
  const [newsletter, setNewsletter] = useState(true);

  const [userData, setUserData] = useState({
    firstName: 'Jan',
    lastName: 'Kowalski',
    country: 'Polska',
    city: 'Kraków',
    addressLine1: 'ul. Kałuży 1',
    addressLine2: '',
    postalCode: '30-111',
  });

  const [tempUserData, setTempUserData] = useState(userData);
  const [currentEmail, setCurrentEmail] = useState('jankowalski@gmail.com');
  const [emailForm, setEmailForm] = useState({ newEmail: '', password: '' });
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });

  const resetForms = () => {
    setTempUserData(userData);
    setEmailForm({ newEmail: '', password: '' });
    setPasswordForm({ current: '', new: '', confirm: '' });
  };

  const toggleSection = (section: Section) => {
    resetForms();
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleCancel = () => {
    resetForms();
    setExpandedSection(null);
  };

  const handleSavePersonal = (e: React.SyntheticEvent) => {
    e.preventDefault();

    const trimmedData = {
      firstName: tempUserData.firstName.trim(),
      lastName: tempUserData.lastName.trim(),
      country: tempUserData.country.trim(),
      city: tempUserData.city.trim(),
      addressLine1: tempUserData.addressLine1.trim(),
      addressLine2: tempUserData.addressLine2.trim(),
      postalCode: tempUserData.postalCode.trim(),
    };

    setUserData(trimmedData);
    alert('Dane osobowe zostały pomyślnie zapisane!');
    setExpandedSection(null);
  };

  const handleEmailChange = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const trimmedNewEmail = emailForm.newEmail.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedNewEmail)) {
      alert('Proszę podać poprawny adres e-mail!');
      return;
    }

    if (trimmedNewEmail === currentEmail) {
      alert('Nowy adres e-mail nie może być taki sam jak obecny!');
      return;
    }
    if (emailForm.password !== 'haslo123') {
      alert('Podano błędne aktualne hasło!');
      return;
    }

    setCurrentEmail(trimmedNewEmail);
    alert('Adres e-mail został zmieniony!');
    setExpandedSection(null);
  };

  const handlePasswordChange = (e: React.SyntheticEvent) => {
    e.preventDefault();

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(passwordForm.new)) {
      alert('Nowe hasło musi mieć co najmniej 8 znaków, zawierać min. 1 literę i 1 cyfrę!');
      return;
    }
    if (passwordForm.current !== 'haslo123') {
      alert('Podano błędne aktualne hasło!');
      return;
    }
    if (passwordForm.new !== passwordForm.confirm) {
      alert('Nowe hasła nie są identyczne!');
      return;
    }
    if (passwordForm.current === passwordForm.new) {
      alert('Nowe hasło musi różnić się od starego!');
      return;
    }

    alert('Hasło zostało zaktualizowane!');
    setExpandedSection(null);
  };

  return (
    <div className="flex w-full flex-col items-center pt-6 text-app-text min-[961px]:pt-12">
      <h2 className="text-center text-3xl min-[961px]:text-5xl">Ustawienia konta</h2>

      <div className="my-6 flex w-full flex-col gap-0.5 overflow-hidden rounded-xl bg-app-borderSoft min-[961px]:m-12 min-[961px]:max-w-[calc(100%-6rem)]">
        <SettingsCard
          title="Dane osobowe i adres"
          subtitle={`${userData.firstName} ${userData.lastName}, ${userData.city}`}
          isExpanded={expandedSection === 'personal'}
          onToggle={() => toggleSection('personal')}
        >
          <form onSubmit={handleSavePersonal}>
            <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
              <input
                type="text"
                name="firstName"
                value={tempUserData.firstName}
                onChange={(e) => setTempUserData({ ...tempUserData, firstName: e.target.value })}
                className="p-3 border rounded-lg border-app-borderSoft bg-app-surface text-app-text outline-none focus:ring-1 focus:ring-app-border"
                placeholder="Imię"
                required
              />
              <input
                type="text"
                name="lastName"
                value={tempUserData.lastName}
                onChange={(e) => setTempUserData({ ...tempUserData, lastName: e.target.value })}
                className="p-3 border rounded-lg border-app-borderSoft bg-app-surface text-app-text outline-none focus:ring-1 focus:ring-app-border"
                placeholder="Nazwisko"
                required
              />
              <input
                type="text"
                name="country"
                value={tempUserData.country}
                onChange={(e) => setTempUserData({ ...tempUserData, country: e.target.value })}
                className="p-3 border rounded-lg border-app-borderSoft bg-app-surface text-app-text outline-none focus:ring-1 focus:ring-app-border"
                placeholder="Państwo"
                required
              />
              <input
                type="text"
                name="city"
                value={tempUserData.city}
                onChange={(e) => setTempUserData({ ...tempUserData, city: e.target.value })}
                className="p-3 border rounded-lg border-app-borderSoft bg-app-surface text-app-text outline-none focus:ring-1 focus:ring-app-border"
                placeholder="Miasto"
                required
              />
              <input
                type="text"
                name="addressLine1"
                value={tempUserData.addressLine1}
                onChange={(e) => setTempUserData({ ...tempUserData, addressLine1: e.target.value })}
                className="p-3 border rounded-lg border-app-borderSoft bg-app-surface text-app-text outline-none focus:ring-1 focus:ring-app-border col-span-full"
                placeholder="Adres - pierwsza linia"
                required
              />
              <input
                type="text"
                name="addressLine2"
                value={tempUserData.addressLine2}
                onChange={(e) => setTempUserData({ ...tempUserData, addressLine2: e.target.value })}
                className="p-3 border rounded-lg border-app-borderSoft bg-app-surface text-app-text outline-none focus:ring-1 focus:ring-app-border col-span-full"
                placeholder="Adres - druga linia (opcjonalne)"
              />
              <input
                type="text"
                name="postalCode"
                value={tempUserData.postalCode}
                onChange={(e) => setTempUserData({ ...tempUserData, postalCode: e.target.value })}
                className="p-3 border rounded-lg border-app-borderSoft bg-app-surface text-app-text outline-none focus:ring-1 focus:ring-app-border"
                placeholder="Kod pocztowy"
                required
              />
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="submit"
                className="px-6 py-2 text-white transition-colors rounded-lg bg-app-surfaceStrong hover:bg-app-surfaceStrong/90"
              >
                Zapisz
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 rounded-lg text-app-textMuted hover:bg-app-surfaceNeutral"
              >
                Anuluj
              </button>
            </div>
          </form>
        </SettingsCard>

        <SettingsCard
          title="Adres e-mail"
          subtitle={currentEmail}
          isExpanded={expandedSection === 'email'}
          onToggle={() => toggleSection('email')}
        >
          <form onSubmit={handleEmailChange}>
            <div className="mt-4 space-y-4">
              <input
                type="email"
                value={emailForm.newEmail}
                onChange={(e) => setEmailForm({ ...emailForm, newEmail: e.target.value })}
                placeholder="Nowy adres e-mail"
                className="w-full p-3 border rounded-lg border-app-borderSoft bg-app-surface text-app-text outline-none focus:ring-1 focus:ring-app-border"
                required
              />
              <input
                type="password"
                value={emailForm.password}
                onChange={(e) => setEmailForm({ ...emailForm, password: e.target.value })}
                placeholder="Aktualne hasło"
                className="w-full p-3 border rounded-lg border-app-borderSoft bg-app-surface text-app-text outline-none focus:ring-1 focus:ring-app-border"
                required
              />
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="submit"
                className="px-6 py-2 text-white transition-colors rounded-lg bg-app-surfaceStrong hover:bg-app-surfaceStrong/90"
              >
                Zmień
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 rounded-lg text-app-textMuted hover:bg-app-surfaceNeutral"
              >
                Anuluj
              </button>
            </div>
          </form>
        </SettingsCard>

        <SettingsCard
          title="Hasło"
          subtitle="••••••••"
          isExpanded={expandedSection === 'password'}
          onToggle={() => toggleSection('password')}
        >
          <form onSubmit={handlePasswordChange}>
            <div className="mt-4 space-y-4">
              <input
                type="password"
                value={passwordForm.current}
                onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                placeholder="Obecne hasło"
                className="w-full p-3 border rounded-lg border-app-borderSoft bg-app-surface text-app-text outline-none focus:ring-1 focus:ring-app-border"
                required
              />
              <input
                type="password"
                value={passwordForm.new}
                onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                placeholder="Nowe hasło"
                className="w-full p-3 border rounded-lg border-app-borderSoft bg-app-surface text-app-text outline-none focus:ring-1 focus:ring-app-border"
                required
              />
              <input
                type="password"
                value={passwordForm.confirm}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                placeholder="Powtórz nowe hasło"
                className="w-full p-3 border rounded-lg border-app-borderSoft bg-app-surface text-app-text outline-none focus:ring-1 focus:ring-app-border"
                required
              />
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="submit"
                className="px-6 py-2 text-white transition-colors rounded-lg bg-app-surfaceStrong hover:bg-app-surfaceStrong/90"
              >
                Zaktualizuj
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 rounded-lg text-app-textMuted hover:bg-app-surfaceNeutral"
              >
                Anuluj
              </button>
            </div>
          </form>
        </SettingsCard>

        <div className="flex select-none items-center justify-between gap-4 bg-app-surfaceElevated p-4 min-[961px]:p-6">
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
