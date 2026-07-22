import { type SubmitEvent, useState } from 'react';

import FormActions from './FormActions.tsx';
import ProfileFormInput from './ProfileFormInput.tsx';

type PasswordFormProps = {
  onSave: () => void;
  onCancel: () => void;
};

export default function PasswordForm({ onSave, onCancel }: PasswordFormProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(newPassword)) {
      alert('Nowe hasło musi mieć co najmniej 8 znaków, zawierać min. 1 literę i 1 cyfrę!');
      return;
    }
    if (currentPassword !== 'haslo123') {
      alert('Podano błędne aktualne hasło!');
      return;
    }
    if (newPassword !== confirmedPassword) {
      alert('Nowe hasła nie są identyczne!');
      return;
    }
    if (currentPassword === newPassword) {
      alert('Nowe hasło musi różnić się od starego!');
      return;
    }

    onSave();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mt-4 space-y-4">
        <ProfileFormInput
          type="password"
          value={currentPassword}
          onChange={(event) => setCurrentPassword(event.target.value)}
          placeholder="Obecne hasło"
          required
        />
        <ProfileFormInput
          type="password"
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          placeholder="Nowe hasło"
          required
        />
        <ProfileFormInput
          type="password"
          value={confirmedPassword}
          onChange={(event) => setConfirmedPassword(event.target.value)}
          placeholder="Powtórz nowe hasło"
          required
        />
      </div>
      <FormActions submitLabel="Zaktualizuj" onCancel={onCancel} />
    </form>
  );
}
