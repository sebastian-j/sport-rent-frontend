import type { InvoiceDetails } from '../userDetails/userDetailsTypes.ts';

type InvoiceDetailsViewProps = {
  details: InvoiceDetails;
};

export default function InvoiceDetailsView({ details }: InvoiceDetailsViewProps) {
  return (
    <dl className="grid w-full max-w-2xl grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
      <div>
        <dt className="text-sm text-app-textMuted">Firma</dt>
        <dd className="mt-1 font-medium text-app-textStrong">{details.company}</dd>
      </div>
      <div>
        <dt className="text-sm text-app-textMuted">NIP</dt>
        <dd className="mt-1 font-medium text-app-textStrong">{details.nip}</dd>
      </div>
      <div>
        <dt className="text-sm text-app-textMuted">Imię i nazwisko</dt>
        <dd className="mt-1 font-medium text-app-textStrong">
          {details.firstName} {details.lastName}
        </dd>
      </div>
      <div>
        <dt className="text-sm text-app-textMuted">Adres</dt>
        <dd className="mt-1 font-medium text-app-textStrong">
          {details.addressLine1}
          {details.addressLine2 && <>, {details.addressLine2}</>}
        </dd>
      </div>
      <div className="sm:col-span-2 md:col-span-1 lg:col-span-2">
        <dt className="text-sm text-app-textMuted">Miejscowość</dt>
        <dd className="mt-1 font-medium text-app-textStrong">
          {details.postalCode} {details.city}, {details.country}
        </dd>
      </div>
    </dl>
  );
}
