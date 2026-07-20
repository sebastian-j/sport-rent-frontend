import { Pencil } from 'lucide-react';
import { useState } from 'react';
import RecipientDetailsForm from './RecipientDetailsForm.tsx';
import RecipientDetailsView from './RecipientDetailsView.tsx';
import type { UserDetails } from '../userDetails/userDetailsTypes.ts';

type RecipientDetailsPanelProps = {
  details: UserDetails;
  onDetailsChange: (details: UserDetails) => void;
};

export default function RecipientDetailsPanel({
  details,
  onDetailsChange,
}: RecipientDetailsPanelProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = (updatedDetails: UserDetails) => {
    onDetailsChange(updatedDetails);
    setIsEditing(false);
  };

  return (
    <section className="flex w-full flex-col items-center gap-6">
      <div className="relative flex w-full items-center justify-center">
        <h2 className="text-2xl font-semibold text-app-textStrong">Dane odbiorcy</h2>
        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            aria-label="Edytuj dane odbiorcy"
            className="absolute right-0 inline-flex h-10 w-10 items-center justify-center rounded-lg text-sm text-app-textMuted transition-colors hover:bg-app-surfaceNeutral hover:text-app-text min-[480px]:h-auto min-[480px]:w-auto min-[480px]:gap-2 min-[480px]:px-3 min-[480px]:py-2"
          >
            <Pencil size={17} />
            <span className="hidden min-[480px]:inline">Edytuj</span>
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
