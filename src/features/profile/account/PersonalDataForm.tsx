import { type SubmitEvent, useState } from 'react';

import FormActions from './FormActions.tsx';
import ProfileFormInput from './ProfileFormInput.tsx';

export type PersonalData = {
  firstName: string;
  lastName: string;
  country: string;
  city: string;
  addressLine1: string;
  addressLine2: string;
  postalCode: string;
};

type PersonalDataFormProps = {
  initialData: PersonalData;
  onSave: (data: PersonalData) => void;
  onCancel: () => void;
};

export default function PersonalDataForm({ initialData, onSave, onCancel }: PersonalDataFormProps) {
  const [formData, setFormData] = useState(initialData);

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSave({
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      country: formData.country.trim(),
      city: formData.city.trim(),
      addressLine1: formData.addressLine1.trim(),
      addressLine2: formData.addressLine2.trim(),
      postalCode: formData.postalCode.trim(),
    });
  };

  const updateField = (field: keyof PersonalData, value: string) => {
    setFormData((currentData) => ({ ...currentData, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <ProfileFormInput
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={(event) => updateField('firstName', event.target.value)}
          placeholder="Imię"
          required
        />
        <ProfileFormInput
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={(event) => updateField('lastName', event.target.value)}
          placeholder="Nazwisko"
          required
        />
        <ProfileFormInput
          type="text"
          name="country"
          value={formData.country}
          onChange={(event) => updateField('country', event.target.value)}
          placeholder="Państwo"
          required
        />
        <ProfileFormInput
          type="text"
          name="city"
          value={formData.city}
          onChange={(event) => updateField('city', event.target.value)}
          placeholder="Miasto"
          required
        />
        <ProfileFormInput
          type="text"
          name="addressLine1"
          value={formData.addressLine1}
          onChange={(event) => updateField('addressLine1', event.target.value)}
          className="col-span-full"
          placeholder="Adres - pierwsza linia"
          required
        />
        <ProfileFormInput
          type="text"
          name="addressLine2"
          value={formData.addressLine2}
          onChange={(event) => updateField('addressLine2', event.target.value)}
          className="col-span-full"
          placeholder="Adres - druga linia (opcjonalne)"
        />
        <ProfileFormInput
          type="text"
          name="postalCode"
          value={formData.postalCode}
          onChange={(event) => updateField('postalCode', event.target.value)}
          placeholder="Kod pocztowy"
          required
        />
      </div>
      <FormActions submitLabel="Zapisz" onCancel={onCancel} />
    </form>
  );
}
