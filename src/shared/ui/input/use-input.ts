import { useMergedRef } from "@mantine/hooks";
import * as React from "react";

type InputValue = React.InputHTMLAttributes<HTMLInputElement>["value"];

interface UseInputOptions {
  defaultValue: InputValue;
  disabled: boolean;
  forwardedRef: React.ForwardedRef<HTMLInputElement>;
  hasValue: boolean | undefined;
  onChange: React.ChangeEventHandler<HTMLInputElement> | undefined;
  onClear: (() => void) | undefined;
  readOnly: boolean;
  type: React.HTMLInputTypeAttribute;
  value: InputValue;
}

interface UseInputResult {
  hasValue: boolean;
  inputRef: React.RefCallback<HTMLInputElement>;
  inputType: React.HTMLInputTypeAttribute;
  isPassword: boolean;
  isPasswordVisible: boolean;
  handleActionPointerDown: React.PointerEventHandler<HTMLButtonElement>;
  handleChange: React.ChangeEventHandler<HTMLInputElement>;
  handleClear: () => void;
  handlePasswordToggle: () => void;
}

const valueIsPresent = (value: InputValue): boolean =>
  value != null && String(value).length > 0;

const setNativeInputValue = (input: HTMLInputElement, value: string): void => {
  const valueSetter = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    "value",
  )?.set;

  if (valueSetter) valueSetter.call(input, value);
  else input.value = value;
};

export const useInput = ({
  defaultValue,
  disabled,
  forwardedRef,
  hasValue: hasValueProp,
  onChange,
  onClear,
  readOnly,
  type,
  value,
}: UseInputOptions): UseInputResult => {
  const innerRef = React.useRef<HTMLInputElement>(null);
  const inputRef = useMergedRef(forwardedRef, innerRef);
  const isControlled = value !== undefined;
  const isPassword = type === "password";

  const [hasUncontrolledValue, setHasUncontrolledValue] = React.useState(() =>
    valueIsPresent(defaultValue),
  );
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

  const hasValue =
    hasValueProp ??
    (isControlled ? valueIsPresent(value) : hasUncontrolledValue);

  React.useEffect(() => {
    if (!isPassword || !hasValue) setIsPasswordVisible(false);
  }, [hasValue, isPassword]);

  const handleChange = React.useCallback<
    React.ChangeEventHandler<HTMLInputElement>
  >(
    event => {
      if (!isControlled && hasValueProp === undefined) {
        setHasUncontrolledValue(event.currentTarget.value.length > 0);
      }

      onChange?.(event);
    },
    [hasValueProp, isControlled, onChange],
  );

  const handleClear = React.useCallback(() => {
    if (disabled || readOnly) return;

    const input = innerRef.current;

    if (input) {
      setNativeInputValue(input, "");
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.focus({ preventScroll: true });
    }

    if (!isControlled && hasValueProp === undefined) {
      setHasUncontrolledValue(false);
    }

    setIsPasswordVisible(false);
    onClear?.();
  }, [disabled, hasValueProp, isControlled, onClear, readOnly]);

  const handlePasswordToggle = React.useCallback(() => {
    if (disabled) return;
    setIsPasswordVisible(isVisible => !isVisible);
  }, [disabled]);

  const handleActionPointerDown = React.useCallback<
    React.PointerEventHandler<HTMLButtonElement>
  >(event => {
    event.preventDefault();
  }, []);

  const inputType = isPassword && isPasswordVisible ? "text" : type;

  return {
    hasValue,
    inputRef,
    inputType,
    isPassword,
    isPasswordVisible,
    handleActionPointerDown,
    handleChange,
    handleClear,
    handlePasswordToggle,
  };
};
