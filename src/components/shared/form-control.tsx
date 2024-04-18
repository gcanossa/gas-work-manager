import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckIcon, ExclamationTriangleIcon } from "@radix-ui/react-icons";

export type FormControlsProp = {
  isPending: boolean;
  submitText: string;
  cancelText: string;
  successText: string;
  submitted: boolean;
  error: string | null;
};

const FormControls: React.FC<FormControlsProp> = (props) => {
  return (
    <>
      {props.submitted ? (
        !props.error ? (
          <Alert>
            <CheckIcon className="h-4 w-4" />
            <AlertTitle>Successo!</AlertTitle>
            <AlertDescription>{props.successText}</AlertDescription>
          </Alert>
        ) : (
          <Alert variant="destructive">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertTitle>Errore!</AlertTitle>
            <AlertDescription>{props.error}</AlertDescription>
          </Alert>
        )
      ) : (
        <div className="flex">
          <Button type="submit" disabled={props.isPending}>
            {props.isPending ? (
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : null}
            {props.submitText}
          </Button>
          <Button
            type="reset"
            onClick={() => window.google.script.host.close()}
            className="ml-3"
            variant="destructive"
            disabled={props.isPending}
          >
            {props.cancelText}
          </Button>
        </div>
      )}
    </>
  );
};

export default FormControls;
