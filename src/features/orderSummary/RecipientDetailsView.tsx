import type { UserDetails } from '../userDetails/userDetailsTypes.ts';

type RecipientDetailsViewProps = {
  details: UserDetails;
};

export default function RecipientDetailsView({ details }: RecipientDetailsViewProps) {
  return (
    <dl className="grid w-full max-w-2xl grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
      <div>
        <dt className="text-sm text-app-textMuted">Imię i nazwisko</dt>
        <dd className="mt-1 font-medium text-app-textStrong">
          {details.firstName} {details.lastName}
        </dd>
      </div>
      <div>
        <dt className="text-sm text-app-textMuted">Państwo</dt>
        <dd className="mt-1 font-medium text-app-textStrong">{details.country}</dd>
      </div>
      <div>
        <dt className="text-sm text-app-textMuted">Adres</dt>
        <dd className="mt-1 font-medium text-app-textStrong">
          {details.addressLine1}
          {details.addressLine2 && <>, {details.addressLine2}</>}
        </dd>
      </div>
      <div>
        <dt className="text-sm text-app-textMuted">Miejscowość</dt>
        <dd className="mt-1 font-medium text-app-textStrong">
          {details.postalCode} {details.city}
        </dd>
      </div>
    </dl>
  );
}
