import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

// ----------------------------------------------------------------------

export type ConfirmDialogProps = {
  open: boolean;
  title: string;
  content: React.ReactNode;
  confirmLabel?: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function ConfirmDialog({
  open,
  title,
  content,
  confirmLabel = 'Delete',
  loading,
  onClose,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="contained" color="error" onClick={onConfirm} loading={loading}>
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
