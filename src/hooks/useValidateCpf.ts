import { useState } from "react";

export function useValidateCPF() {
  const [cpfError, setCpfError] = useState("");

  const validateCPF = (value: string): boolean => {
    const digits = value.replace(/\D/g, "");

    if (digits.length < 11) {
      setCpfError("");
      return false;
    }

    if (/^(\d)\1+$/.test(digits)) {
      setCpfError("CPF inválido.");
      return false;
    }

    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(digits[i]) * (10 - i);
    let firstCheck = (sum * 10) % 11;
    if (firstCheck === 10) firstCheck = 0;
    if (firstCheck !== parseInt(digits[9])) {
      setCpfError("CPF inválido.");
      return false;
    }

    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(digits[i]) * (11 - i);
    let secondCheck = (sum * 10) % 11;
    if (secondCheck === 10) secondCheck = 0;
    if (secondCheck !== parseInt(digits[10])) {
      setCpfError("CPF inválido.");
      return false;
    }

    setCpfError("");
    return true;
  };

  return { validateCPF, cpfError };
}
