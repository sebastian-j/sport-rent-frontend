import { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';

type Section = 'personal' | 'email' | 'password' | null;

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

  const toggleSection = (section: Section) => {
    if (section === 'personal' && expandedSection !== 'personal') {
      setTempUserData(userData);
    }
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleTempUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempUserData({ ...tempUserData, [e.target.name]: e.target.value });
  };

  const handleSavePersonal = () => {
    if (
      !tempUserData.firstName ||
      !tempUserData.lastName ||
      !tempUserData.country ||
      !tempUserData.city ||
      !tempUserData.addressLine1 ||
      !tempUserData.postalCode
    ) {
      alert('Proszę wypełnić wszystkie wymagane pola!');
      return;
    }
    setUserData(tempUserData);
    alert('Dane osobowe zostały pomyślnie zapisane!');
    setExpandedSection(null);
  };

  const handleEmailChange = () => {
    if (!emailForm.newEmail || !emailForm.password) {
      alert('Proszę wypełnić oba pola!');
      return;
    }
    if (emailForm.newEmail === currentEmail) {
      alert('Nowy adres e-mail nie może być taki sam jak obecny!');
      return;
    }
    if (emailForm.password !== 'haslo123') {
      alert('Podano błędne aktualne hasło!');
      return;
    }
    setCurrentEmail(emailForm.newEmail);
    setEmailForm({ newEmail: '', password: '' });
    alert('Adres e-mail został zmieniony!');
    setExpandedSection(null);
  };

  const handlePasswordChange = () => {
    if (!passwordForm.current || !passwordForm.new || !passwordForm.confirm) {
      alert('Proszę wypełnić wszystkie pola!');
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
    setPasswordForm({ current: '', new: '', confirm: '' });
    alert('Hasło zostało zaktualizowane!');
    setExpandedSection(null);
  };

  return (
    <div className="w-full flex flex-col gap-8 text-slate-800">
      <h2 className="text-4xl font-bold text-center text-slate-900">Ustawienia konta</h2>

      <div className="flex flex-col gap-0.5 overflow-hidden rounded-xl bg-slate-300">
        <div className="bg-white">
          <div
            className="p-6 flex justify-between items-center cursor-pointer hover:bg-slate-50 transition-colors select-none"
            onClick={() => toggleSection('personal')}
          >
            <div>
              <h2 className="text-lg font-bold">Dane osobowe i adres</h2>
              <p className="text-sm text-slate-500 mt-1">
                {userData.firstName} {userData.lastName}, {userData.city}
              </p>
            </div>
            {expandedSection === 'personal' ? (
              <ChevronDown className="text-slate-400" />
            ) : (
              <ChevronRight className="text-slate-400" />
            )}
          </div>

          {expandedSection === 'personal' && (
            <div className="p-6 pt-0 border-t border-slate-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <input
                  type="text"
                  name="firstName"
                  value={tempUserData.firstName}
                  onChange={handleTempUserChange}
                  className="p-3 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-slate-900"
                  placeholder="Imię"
                />
                <input
                  type="text"
                  name="lastName"
                  value={tempUserData.lastName}
                  onChange={handleTempUserChange}
                  className="p-3 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-slate-900"
                  placeholder="Nazwisko"
                />
                <input
                  type="text"
                  name="country"
                  value={tempUserData.country}
                  onChange={handleTempUserChange}
                  className="p-3 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-slate-900"
                  placeholder="Państwo"
                />
                <input
                  type="text"
                  name="city"
                  value={tempUserData.city}
                  onChange={handleTempUserChange}
                  className="p-3 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-slate-900"
                  placeholder="Miasto"
                />
                <input
                  type="text"
                  name="addressLine1"
                  value={tempUserData.addressLine1}
                  onChange={handleTempUserChange}
                  className="p-3 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-slate-900 col-span-full"
                  placeholder="Adres - pierwsza linia"
                />
                <input
                  type="text"
                  name="addressLine2"
                  value={tempUserData.addressLine2}
                  onChange={handleTempUserChange}
                  className="p-3 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-slate-900 col-span-full"
                  placeholder="Adres - druga linia (opcjonalne)"
                />
                <input
                  type="text"
                  name="postalCode"
                  value={tempUserData.postalCode}
                  onChange={handleTempUserChange}
                  className="p-3 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-slate-900"
                  placeholder="Kod pocztowy"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSavePersonal}
                  className="bg-slate-900 text-white px-6 py-2 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Zapisz
                </button>
                <button
                  onClick={() => setExpandedSection(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Anuluj
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white">
          <div
            className="p-6 flex justify-between items-center cursor-pointer hover:bg-slate-50 transition-colors select-none"
            onClick={() => toggleSection('email')}
          >
            <div>
              <h2 className="text-lg font-bold">Adres e-mail</h2>
              <p className="text-sm text-slate-500 mt-1">{currentEmail}</p>
            </div>
            {expandedSection === 'email' ? (
              <ChevronDown className="text-slate-400" />
            ) : (
              <ChevronRight className="text-slate-400" />
            )}
          </div>

          {expandedSection === 'email' && (
            <div className="p-6 pt-0 border-t border-slate-100">
              <div className="space-y-4 mt-4">
                <input
                  type="email"
                  value={emailForm.newEmail}
                  onChange={(e) => setEmailForm({ ...emailForm, newEmail: e.target.value })}
                  placeholder="Nowy adres e-mail"
                  className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-slate-900"
                />
                <input
                  type="password"
                  value={emailForm.password}
                  onChange={(e) => setEmailForm({ ...emailForm, password: e.target.value })}
                  placeholder="Aktualne hasło"
                  className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleEmailChange}
                  className="bg-slate-900 text-white px-6 py-2 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Zmień
                </button>
                <button
                  onClick={() => {
                    setExpandedSection(null);
                    setEmailForm({ newEmail: '', password: '' });
                  }}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Anuluj
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white">
          <div
            className="p-6 flex justify-between items-center cursor-pointer hover:bg-slate-50 transition-colors select-none"
            onClick={() => toggleSection('password')}
          >
            <div>
              <h2 className="text-lg font-bold">Hasło</h2>
              <p className="text-sm text-slate-500 mt-1">••••••••</p>
            </div>
            {expandedSection === 'password' ? (
              <ChevronDown className="text-slate-400" />
            ) : (
              <ChevronRight className="text-slate-400" />
            )}
          </div>

          {expandedSection === 'password' && (
            <div className="p-6 pt-0 border-t border-slate-100">
              <div className="space-y-4 mt-4">
                <input
                  type="password"
                  value={passwordForm.current}
                  onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                  placeholder="Obecne hasło"
                  className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-slate-900"
                />
                <input
                  type="password"
                  value={passwordForm.new}
                  onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                  placeholder="Nowe hasło"
                  className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-slate-900"
                />
                <input
                  type="password"
                  value={passwordForm.confirm}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                  placeholder="Powtórz nowe hasło"
                  className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handlePasswordChange}
                  className="bg-slate-900 text-white px-6 py-2 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Zaktualizuj
                </button>
                <button
                  onClick={() => {
                    setExpandedSection(null);
                    setPasswordForm({ current: '', new: '', confirm: '' });
                  }}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Anuluj
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white p-6 flex justify-between items-center select-none">
          <div>
            <h2 className="text-lg font-bold">Newsletter</h2>
            <p className="text-sm text-slate-500 mt-1">Otrzymuj informacje o promocjach</p>
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
