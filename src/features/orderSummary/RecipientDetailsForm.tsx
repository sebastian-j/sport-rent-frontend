import { type SubmitEvent, useState } from 'react';

import FormActions from '../../components/core/FormActions.tsx';
import UserDetailsFields from '../userDetails/UserDetailsFields.tsx';
import type { UserDetails } from '../userDetails/userDetailsTypes.ts';

type RecipientDetailsFormProps = {
  initialDetails: UserDetails;
  onSave: (details: UserDetails) => void;
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
      country: details.country.trim(),
      city: details.city.trim(),
      addressLine1: details.addressLine1.trim(),
      addressLine2: details.addressLine2.trim(),
      postalCode: details.postalCode.trim(),
    });
  };

  return (
    <form onSubmit={handleSave} className="w-full max-w-2xl">
      <UserDetailsFields details={details} onDetailsChange={setDetails} showLabels />
      <FormActions submitLabel="Zapisz" onCancel={onCancel} />
    </form>
  );
}
