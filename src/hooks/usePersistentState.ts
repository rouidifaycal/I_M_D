import { useCallback, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { readLocalStorageValue } from "../utils/localStorage";

type PersistentState<T> = {
  value: T;
  setValue: Dispatch<SetStateAction<T>>;
  storageError: string;
};

export function usePersistentState<T>(
  key: string,
  fallback: T,
  isValid: (value: unknown) => value is T
): PersistentState<T> {
  const [value, setValue] = useState<T>(() =>
    readLocalStorageValue(key, fallback, isValid)
  );
  const currentValueRef = useRef(value);
  const [storageError, setStorageError] = useState("");

  const setPersistentValue = useCallback<Dispatch<SetStateAction<T>>>(
    (action) => {
      const nextValue =
        typeof action === "function"
          ? (action as (previous: T) => T)(currentValueRef.current)
          : action;
      currentValueRef.current = nextValue;
      setValue(nextValue);

      try {
        window.localStorage.setItem(key, JSON.stringify(nextValue));
        setStorageError("");
      } catch (error) {
        console.error(
          `Unable to save inventory data to localStorage key "${key}".`,
          error
        );
        setStorageError("Changes could not be saved in this browser.");
      }
    },
    [key]
  );

  return { value, setValue: setPersistentValue, storageError };
}
