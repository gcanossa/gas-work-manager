import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckIcon, ExclamationTriangleIcon } from "@radix-ui/react-icons";

export const AlertSuccess: React.FC<{ text?: string }> = ({ text }) => (
  <Alert>
    <CheckIcon className="h-4 w-4" />
    <AlertTitle>Successo!</AlertTitle>
    <AlertDescription>{text ?? "Salvataggio effettuato"}</AlertDescription>
  </Alert>
);

export const AlertError: React.FC<{ error: string }> = ({ error }) => (
  <Alert variant="destructive">
    <ExclamationTriangleIcon className="h-4 w-4" />
    <AlertTitle>Errore!</AlertTitle>
    <AlertDescription>{error}</AlertDescription>
  </Alert>
);
