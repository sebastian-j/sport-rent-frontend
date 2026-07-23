import FormInput from '../../components/core/FormInput.tsx';
import type { UserDetails } from './userDetailsTypes.ts';

type UserDetailsFieldsProps = {
  details: UserDetails;
  onDetailsChange: (details: UserDetails) => void;
  showLabels?: boolean;
  allOptional?: boolean;
  className?: string;
};

type UserDetailsField = {
  name: keyof UserDetails;
  label: string;
  placeholder: string;
  required?: boolean;
  fullWidth?: boolean;
};

const USER_DETAILS_FIELDS: UserDetailsField[] = [
  { name: 'firstName', label: 'Imię', placeholder: 'Imię', required: true },
  { name: 'lastName', label: 'Nazwisko', placeholder: 'Nazwisko', required: true },
  { name: 'country', label: 'Państwo', placeholder: 'Państwo', required: true },
  { name: 'city', label: 'Miasto', placeholder: 'Miasto', required: true },
  {
    name: 'addressLine1',
    label: 'Adres',
    placeholder: 'Adres - pierwsza linia',
    required: true,
    fullWidth: true,
  },
  {
    name: 'addressLine2',
    label: 'Druga linia adresu (opcjonalnie)',
    placeholder: 'Adres - druga linia (opcjonalne)',
  },
  { name: 'postalCode', label: 'Kod pocztowy', placeholder: 'Kod pocztowy', required: true },
];

export default function UserDetailsFields({
  details,
  onDetailsChange,
  showLabels = false,
  allOptional = false,
  className = '',
}: UserDetailsFieldsProps) {
  const updateField = (name: keyof UserDetails, value: string) => {
    onDetailsChange({ ...details, [name]: value });
  };

  return (
    <div
      className={`grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 ${className}`}
    >
      {USER_DETAILS_FIELDS.map(({ name, label, placeholder, required, fullWidth }) => {
        const input = (
          <FormInput
            type="text"
            name={name}
            value={details[name]}
            onChange={(event) => updateField(name, event.currentTarget.value)}
            placeholder={showLabels ? undefined : placeholder}
            required={allOptional ? false : required}
          />
        );

        return showLabels ? (
          <label
            key={name}
            className={`flex flex-col gap-1 text-sm text-app-textMuted ${
              fullWidth ? 'sm:col-span-2 md:col-span-1 lg:col-span-2' : ''
            }`}
          >
            {label}
            {input}
          </label>
        ) : (
          <div key={name} className={fullWidth ? 'col-span-full' : undefined}>
            {input}
          </div>
        );
      })}
    </div>
  );
}
