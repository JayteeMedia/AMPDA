import Button from "../buttons/Button.js";
import Modal from "./Modal.js";

interface ConfirmDialogProps {

  open: boolean;

  title: string;

  message: string;

  onConfirm(): void;

  onCancel(): void;

}

export default function ConfirmDialog({

  open,

  title,

  message,

  onConfirm,

  onCancel,

}: ConfirmDialogProps) {

  return (

    <Modal open={open}>

      <h2>{title}</h2>

      <p>{message}</p>

      <div

        style={{

          display: "flex",

          justifyContent:
            "flex-end",

          gap: 12,

          marginTop: 24,

        }}

      >

        <Button

          variant="secondary"

          onClick={onCancel}

        >

          Cancel

        </Button>

        <Button

          variant="danger"

          onClick={onConfirm}

        >

          Confirm

        </Button>

      </div>

    </Modal>

  );

}
