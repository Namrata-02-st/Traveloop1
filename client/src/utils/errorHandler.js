import toast from 'react-hot-toast';

export const getErrorMessage = (err) => err?.response?.data?.error || err?.message || 'Something went wrong. Please try again.';

export const showApiError = (err) => {
  const message = getErrorMessage(err);
  toast.error(message);
  return message;
};
