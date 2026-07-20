import { Pencil } from 'lucide-react';
import { useState, type SyntheticEvent } from 'react';

export type RecipientDetails = {
  firstName: string;
  lastName: string;
  country: string;
  city: string;
  addressLine1: string;
  addressLine2: string;
  postalCode: string;
};

type RecipientDetailsPanelProps = {
  details: RecipientDetails;
  onDetailsChange: (details: RecipientDetails) => void;
};

const inputClassName =
  'w-full rounded-lg border border-app-borderSoft bg-app-surface p-3 text-app-text outline-none focus:ring-1 focus:ring-app-border';

export default function RecipientDetailsPanel({
  details,
  onDetailsChange,
}: RecipientDetailsPanelProps) {
  const [editedDetails, setEditedDetails] = useState(details);
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setEditedDetails(details);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedDetails(details);
    setIsEditing(false);
  };

  const handleSave = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    onDetailsChange({
      firstName: editedDetails.firstName.trim(),
      lastName: editedDetails.lastName.trim(),
      country: editedDetails.country.trim(),
      city: editedDetails.city.trim(),
      addressLine1: editedDetails.addressLine1.trim(),
      addressLine2: editedDetails.addressLine2.trim(),
      postalCode: editedDetails.postalCode.trim(),
    });
    setIsEditing(false);
  };

  return (
    <section className="flex w-full flex-col items-center gap-6">
      <div className="relative flex w-full items-center justify-center">
        <h2 className="text-2xl font-semibold text-app-textStrong">Dane odbiorcy</h2>
        {!isEditing && (
          <button
            type="button"
            onClick={handleEdit}
            aria-label="Edytuj dane odbiorcy"
            className="absolute right-0 inline-flex h-10 w-10 items-center justify-center rounded-lg text-sm text-app-textMuted transition-colors hover:bg-app-surfaceNeutral hover:text-app-text min-[480px]:h-auto min-[480px]:w-auto min-[480px]:gap-2 min-[480px]:px-3 min-[480px]:py-2"
          >
            <Pencil size={17} />
            <span className="hidden min-[480px]:inline">Edytuj</span>
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} className="w-full max-w-2xl">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm text-app-textMuted">
              Imię
              <input
                type="text"
                value={editedDetails.firstName}
                onChange={(event) =>
                  setEditedDetails({ ...editedDetails, firstName: event.currentTarget.value })
                }
                className={inputClassName}
                required
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-app-textMuted">
              Nazwisko
              <input
                type="text"
                value={editedDetails.lastName}
                onChange={(event) =>
                  setEditedDetails({ ...editedDetails, lastName: event.currentTarget.value })
                }
                className={inputClassName}
                required
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-app-textMuted">
              Państwo
              <input
                type="text"
                value={editedDetails.country}
                onChange={(event) =>
                  setEditedDetails({ ...editedDetails, country: event.currentTarget.value })
                }
                className={inputClassName}
                required
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-app-textMuted">
              Miasto
              <input
                type="text"
                value={editedDetails.city}
                onChange={(event) =>
                  setEditedDetails({ ...editedDetails, city: event.currentTarget.value })
                }
                className={inputClassName}
                required
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-app-textMuted md:col-span-2">
              Adres
              <input
                type="text"
                value={editedDetails.addressLine1}
                onChange={(event) =>
                  setEditedDetails({ ...editedDetails, addressLine1: event.currentTarget.value })
                }
                className={inputClassName}
                required
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-app-textMuted md:col-span-2">
              Druga linia adresu (opcjonalnie)
              <input
                type="text"
                value={editedDetails.addressLine2}
                onChange={(event) =>
                  setEditedDetails({ ...editedDetails, addressLine2: event.currentTarget.value })
                }
                className={inputClassName}
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-app-textMuted">
              Kod pocztowy
              <input
                type="text"
                value={editedDetails.postalCode}
                onChange={(event) =>
                  setEditedDetails({ ...editedDetails, postalCode: event.currentTarget.value })
                }
                className={inputClassName}
                required
              />
            </label>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              className="rounded-lg bg-app-surfaceStrong px-6 py-2 text-app-textInverted transition-colors hover:bg-app-surfaceStrong/90"
            >
              Zapisz
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-lg px-4 py-2 text-app-textMuted hover:bg-app-surfaceNeutral"
            >
              Anuluj
            </button>
          </div>
        </form>
      ) : (
        <dl className="grid w-full max-w-2xl gap-x-8 gap-y-5 sm:grid-cols-2">
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
      )}
    </section>
  );
}
