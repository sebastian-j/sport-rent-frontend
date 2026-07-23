import { type SubmitEvent, useState } from 'react';

import FormActions from '../../components/core/FormActions.tsx';
import FormInput from '../../components/core/FormInput.tsx';
import UserDetailsFields from '../userDetails/UserDetailsFields.tsx';
import type { InvoiceDetails, UserDetails } from '../userDetails/userDetailsTypes.ts';

type InvoiceDetailsFormProps = {
  initialDetails: InvoiceDetails;
  onSave: (details: InvoiceDetails) => void;
  onCancel: () => void;
};

export default function InvoiceDetailsForm({
  initialDetails,
  onSave,
  onCancel,
}: InvoiceDetailsFormProps) {
  const [details, setDetails] = useState(initialDetails);

  const handleUserDetailsChange = (userDetails: UserDetails) => {
    setDetails((currentDetails) => ({ ...currentDetails, ...userDetails }));
  };

  const handleSave = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSave({
      company: details.company.trim(),
      nip: details.nip.trim(),
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
      <p className="mb-4 text-sm text-app-textMuted">Pole oznaczone * jest wymagane.</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm text-app-textMuted">
          Firma *
          <FormInput
            type="text"
            name="company"
            autoComplete="organization"
            value={details.company}
            onChange={(event) => setDetails({ ...details, company: event.currentTarget.value })}
            required
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-app-textMuted">
          NIP
          <FormInput
            type="text"
            name="nip"
            inputMode="numeric"
            value={details.nip}
            onChange={(event) => setDetails({ ...details, nip: event.currentTarget.value })}
          />
        </label>
      </div>

      <UserDetailsFields
        details={details}
        onDetailsChange={handleUserDetailsChange}
        className="mt-4"
        allOptional
        showLabels
      />
      <FormActions submitLabel="Zapisz" onCancel={onCancel} />
    </form>
  );
}
