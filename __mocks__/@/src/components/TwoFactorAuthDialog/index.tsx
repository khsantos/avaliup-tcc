import React from "react";

const TwoFactorAuthDialog = ({
  open,
  onClose,
  onVerified,
}: {
  open: boolean;
  onClose: () => void;
  onVerified: (token: string) => void;
}) => {
  if (!open) return null;

  return (
    <div data-testid="mocked-2fa-dialog">
      <h2>Mocked 2FA Dialog</h2>
      <button onClick={() => onVerified("fake_token")} data-testid="verify-btn">
        Mock Verificar
      </button>
      <button onClick={onClose} data-testid="close-btn">
        Mock Fechar
      </button>
    </div>
  );
};

export default TwoFactorAuthDialog;
