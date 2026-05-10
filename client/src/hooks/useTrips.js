import { useCallback, useEffect, useState } from 'react';
import { tripsApi } from '../api/trips.api';
import { showApiError } from '../utils/errorHandler';

export default function useTrips(params) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTrips = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await tripsApi.list(params);
      setTrips(data.data);
    } catch (err) {
      showApiError(err);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    loadTrips();
  }, [loadTrips]);

  return { trips, setTrips, loading, reload: loadTrips };
}
