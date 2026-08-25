import { useEffect, useState } from 'react';

import { getManufacturers, type ManufacturerItem } from '../../api/manufacturer.ts';

type ManufacturersState = {
  manufacturers: ManufacturerItem[];
  isLoading: boolean;
  error: Error | null;
};

let cachedManufacturers: ManufacturerItem[] | null = null;
let manufacturersRequest: Promise<ManufacturerItem[]> | null = null;

const loadManufacturers = async (): Promise<ManufacturerItem[]> => {
  if (cachedManufacturers) return cachedManufacturers;

  if (!manufacturersRequest) {
    manufacturersRequest = getManufacturers().then(({ data, error }) => {
      if (error || !data) {
        manufacturersRequest = null;
        throw error ?? new Error('Nie udało się załadować producentów.');
      }

      cachedManufacturers = data;
      return data;
    });
  }

  return manufacturersRequest;
};

export default function useManufacturers() {
  const [state, setState] = useState<ManufacturersState>(() => ({
    manufacturers: cachedManufacturers ?? [],
    isLoading: cachedManufacturers === null,
    error: null,
  }));

  useEffect(() => {
    if (cachedManufacturers) return;

    let active = true;

    void loadManufacturers()
      .then((manufacturers) => {
        if (!active) return;

        setState({
          manufacturers,
          isLoading: false,
          error: null,
        });
      })
      .catch((error: unknown) => {
        if (!active) return;

        setState({
          manufacturers: [],
          isLoading: false,
          error: error instanceof Error ? error : new Error('Nie udało się załadować producentów.'),
        });
      });

    return () => {
      active = false;
    };
  }, []);

  return state;
}
