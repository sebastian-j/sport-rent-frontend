import { type SubmitEvent, useState } from 'react';

import FormActions from '../../components/core/FormActions.tsx';
import FormInput from '../../components/core/FormInput.tsx';
import type { RecipientDetails } from '../userDetails/userDetailsTypes.ts';

type RecipientDetailsFormProps = {
  initialDetails: RecipientDetails;
  onSave: (details: RecipientDetails) => void;
  onCancel: () => void;
};

export default function RecipientDetailsForm({
  initialDetails,
  onSave,
  onCancel,
}: RecipientDetailsFormProps) {
  const [details, setDetails] = useState(initialDetails);

  const handleSave = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSave({
      firstName: details.firstName.trim(),
      lastName: details.lastName.trim(),
    });
  };

  return (
    <form onSubmit={handleSave} className="w-full max-w-2xl">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm text-app-textMuted">
          Imię
          <FormInput
            type="text"
            name="firstName"
            value={details.firstName}
            onChange={(event) => setDetails({ ...details, firstName: event.currentTarget.value })}
            required
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-app-textMuted">
          Nazwisko
          <FormInput
            type="text"
            name="lastName"
            value={details.lastName}
            onChange={(event) => setDetails({ ...details, lastName: event.currentTarget.value })}
            required
          />
        </label>
      </div>
      <FormActions submitLabel="Zapisz" onCancel={onCancel} />
    </form>
  );
}
