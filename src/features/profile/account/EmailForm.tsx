import { type SubmitEvent, useState } from 'react';
import FormActions from './FormActions.tsx';
import ProfileFormInput from './ProfileFormInput.tsx';

type EmailFormProps = {
  currentEmail: string;
  onSave: (email: string) => void;
  onCancel: () => void;
};

export default function EmailForm({ currentEmail, onSave, onCancel }: EmailFormProps) {
  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedEmail = newEmail.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      alert('Proszę podać poprawny adres e-mail!');
      return;
    }
    if (trimmedEmail === currentEmail) {
      alert('Nowy adres e-mail nie może być taki sam jak obecny!');
      return;
    }
    if (password !== 'haslo123') {
      alert('Podano błędne aktualne hasło!');
      return;
    }

    onSave(trimmedEmail);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mt-4 space-y-4">
        <ProfileFormInput
          type="email"
          value={newEmail}
          onChange={(event) => setNewEmail(event.target.value)}
          placeholder="Nowy adres e-mail"
          required
        />
        <ProfileFormInput
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Aktualne hasło"
          required
        />
      </div>
      <FormActions submitLabel="Zmień" onCancel={onCancel} />
    </form>
  );
}
