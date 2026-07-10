import { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';

type Section = 'personal' | 'email' | 'password' | null;

type SettingsCardProps = {
  title: string;
  subtitle: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
};

function SettingsCard({ title, subtitle, isExpanded, onToggle, children }: SettingsCardProps) {
  return (
    <div className="bg-white">
      <div
        className="flex items-center justify-between p-6 transition-colors cursor-pointer hover:bg-slate-50 select-none"
        onClick={onToggle}
      >
        <div>
          <h2 className="text-lg font-bold">{title}</h2>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        </div>
        {isExpanded ? (
          <ChevronDown className="text-slate-400" />
        ) : (
          <ChevronRight className="text-slate-400" />
        )}
      </div>
      {isExpanded && <div className="p-6 pt-0 border-t border-slate-100">{children}</div>}
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

  const handleTempUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempUserData({ ...tempUserData, [e.target.name]: e.target.value });
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
    <div className="flex flex-col items-center w-full pt-12 text-slate-800">
      <h2 className="text-5xl text-center">Ustawienia konta</h2>

      <div className="m-12 flex w-full max-w-[calc(100%-6rem)] flex-col gap-0.5 overflow-hidden rounded-xl bg-slate-300">
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
                onChange={handleTempUserChange}
                className="p-3 border rounded-lg border-slate-200 outline-none focus:ring-1 focus:ring-slate-900"
                placeholder="Imię"
                required
              />
              <input
                type="text"
                name="lastName"
                value={tempUserData.lastName}
                onChange={handleTempUserChange}
                className="p-3 border rounded-lg border-slate-200 outline-none focus:ring-1 focus:ring-slate-900"
                placeholder="Nazwisko"
                required
              />
              <input
                type="text"
                name="country"
                value={tempUserData.country}
                onChange={handleTempUserChange}
                className="p-3 border rounded-lg border-slate-200 outline-none focus:ring-1 focus:ring-slate-900"
                placeholder="Państwo"
                required
              />
              <input
                type="text"
                name="city"
                value={tempUserData.city}
                onChange={handleTempUserChange}
                className="p-3 border rounded-lg border-slate-200 outline-none focus:ring-1 focus:ring-slate-900"
                placeholder="Miasto"
                required
              />
              <input
                type="text"
                name="addressLine1"
                value={tempUserData.addressLine1}
                onChange={handleTempUserChange}
                className="p-3 border rounded-lg border-slate-200 outline-none focus:ring-1 focus:ring-slate-900 col-span-full"
                placeholder="Adres - pierwsza linia"
                required
              />
              <input
                type="text"
                name="addressLine2"
                value={tempUserData.addressLine2}
                onChange={handleTempUserChange}
                className="p-3 border rounded-lg border-slate-200 outline-none focus:ring-1 focus:ring-slate-900 col-span-full"
                placeholder="Adres - druga linia (opcjonalne)"
              />
              <input
                type="text"
                name="postalCode"
                value={tempUserData.postalCode}
                onChange={handleTempUserChange}
                className="p-3 border rounded-lg border-slate-200 outline-none focus:ring-1 focus:ring-slate-900"
                placeholder="Kod pocztowy"
                required
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                type="submit"
                className="px-6 py-2 text-white transition-colors rounded-lg bg-slate-900 hover:bg-slate-800"
              >
                Zapisz
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100"
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
                className="w-full p-3 border rounded-lg border-slate-200 outline-none focus:ring-1 focus:ring-slate-900"
                required
              />
              <input
                type="password"
                value={emailForm.password}
                onChange={(e) => setEmailForm({ ...emailForm, password: e.target.value })}
                placeholder="Aktualne hasło"
                className="w-full p-3 border rounded-lg border-slate-200 outline-none focus:ring-1 focus:ring-slate-900"
                required
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                type="submit"
                className="px-6 py-2 text-white transition-colors rounded-lg bg-slate-900 hover:bg-slate-800"
              >
                Zmień
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100"
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
                className="w-full p-3 border rounded-lg border-slate-200 outline-none focus:ring-1 focus:ring-slate-900"
                required
              />
              <input
                type="password"
                value={passwordForm.new}
                onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                placeholder="Nowe hasło"
                className="w-full p-3 border rounded-lg border-slate-200 outline-none focus:ring-1 focus:ring-slate-900"
                required
              />
              <input
                type="password"
                value={passwordForm.confirm}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                placeholder="Powtórz nowe hasło"
                className="w-full p-3 border rounded-lg border-slate-200 outline-none focus:ring-1 focus:ring-slate-900"
                required
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                type="submit"
                className="px-6 py-2 text-white transition-colors rounded-lg bg-slate-900 hover:bg-slate-800"
              >
                Zaktualizuj
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100"
              >
                Anuluj
              </button>
            </div>
          </form>
        </SettingsCard>

        <div className="flex items-center justify-between p-6 bg-white select-none">
          <div>
            <h2 className="text-lg font-bold">Newsletter</h2>
            <p className="mt-1 text-sm text-slate-500">Otrzymuj informacje o promocjach</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={newsletter}
              onChange={() => setNewsletter(!newsletter)}
            />
            <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-slate-900 transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
          </label>
        </div>
      </div>
    </div>
  );
}
