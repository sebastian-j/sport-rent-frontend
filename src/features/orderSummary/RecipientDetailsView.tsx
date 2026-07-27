import type { RecipientDetails } from '../userDetails/userDetailsTypes.ts';

type RecipientDetailsViewProps = {
  details: RecipientDetails;
};

export default function RecipientDetailsView({ details }: RecipientDetailsViewProps) {
  return (
    <dl className="grid w-full max-w-2xl grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
      <div>
        <dt className="text-sm text-app-textMuted">Imię</dt>
        <dd className="mt-1 font-medium text-app-textStrong">{details.firstName}</dd>
      </div>
      <div>
        <dt className="text-sm text-app-textMuted">Nazwisko</dt>
        <dd className="mt-1 font-medium text-app-textStrong">{details.lastName}</dd>
      </div>
    </dl>
  );
}
