import { Pencil } from 'lucide-react';
import { useState } from 'react';

import type { RecipientDetails } from '../userDetails/userDetailsTypes.ts';
import RecipientDetailsForm from './RecipientDetailsForm.tsx';
import RecipientDetailsView from './RecipientDetailsView.tsx';

type RecipientDetailsPanelProps = {
  details: RecipientDetails;
  onDetailsChange: (details: RecipientDetails) => void;
};

export default function RecipientDetailsPanel({
  details,
  onDetailsChange,
}: RecipientDetailsPanelProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = (updatedDetails: RecipientDetails) => {
    onDetailsChange(updatedDetails);
    setIsEditing(false);
  };

  return (
    <section className="flex w-full flex-col items-center gap-6">
      <div className="relative flex w-full items-center justify-center px-12 sm:px-16 md:px-12 lg:px-16">
        <h2 className="min-w-0 text-center text-2xl font-semibold leading-tight text-app-textStrong">
          Dane odbiorcy
        </h2>
        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            aria-label="Edytuj dane odbiorcy"
            className="absolute right-0 inline-flex h-10 w-10 items-center justify-center rounded-lg text-sm text-app-textMuted transition-colors hover:bg-app-surfaceNeutral hover:text-app-text sm:h-auto sm:w-auto sm:gap-2 sm:px-3 sm:py-2 md:h-10 md:w-10 md:gap-0 md:p-0 lg:h-auto lg:w-auto lg:gap-2 lg:px-3 lg:py-2"
          >
            <Pencil size={17} />
            <span className="hidden sm:inline md:hidden lg:inline">Edytuj</span>
          </button>
        )}
      </div>

      {isEditing ? (
        <RecipientDetailsForm
          initialDetails={details}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <RecipientDetailsView details={details} />
      )}
    </section>
  );
}
