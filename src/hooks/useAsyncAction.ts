import { useState, useCallback } from "react";
import { toast } from "sonner";

interface AsyncActionOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  successMessage?: string;
  errorMessage?: string;
}

interface AsyncActionState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Custom hook for handling async actions with built-in loading states and error handling
 * Wraps async operations in try/catch and displays toast notifications on errors
 */
export function useAsyncAction<T = unknown>() {
  const [state, setState] = useState<AsyncActionState<T>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const execute = useCallback(
    async (
      asyncFunction: () => Promise<T>,
      options: AsyncActionOptions<T> = {}
    ): Promise<T | null> => {
      const { onSuccess, onError, successMessage, errorMessage } = options;

      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const result = await asyncFunction();
        setState({ data: result, isLoading: false, error: null });

        if (successMessage) {
          toast.success(successMessage);
        }

        onSuccess?.(result);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("An unexpected error occurred");
        setState((prev) => ({ ...prev, isLoading: false, error }));

        // Display graceful toast notification with retry action
        toast.error(errorMessage || error.message || "Operation failed", {
          action: {
            label: "Try Again",
            onClick: () => execute(asyncFunction, options),
          },
        });

        onError?.(error);
        return null;
      }
    },
    []
  );

  const reset = useCallback(() => {
    setState({ data: null, isLoading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

export default useAsyncAction;
