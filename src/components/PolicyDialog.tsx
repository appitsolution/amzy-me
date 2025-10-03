import React from "react";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import TermsContent from '../content/TermsContent';
import PrivacyContent from '../content/PrivacyContent';

interface PolicyDialogProps {
  open: boolean;
  title: string;
  type: 'privacy' | 'terms';
  onClose: () => void;
}

export default function PolicyDialog({ open, title, type, onClose }: PolicyDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ pr: 6 }}>
        {title}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      {type === 'terms' && (
        <DialogContent dividers sx={{ p: { xs: 2, md: 3 }, height: { xs: 600, md: 600 }, overflow: 'auto' }}>
          <TermsContent />
        </DialogContent>
      )}
      {type === 'privacy' && (
        <DialogContent dividers sx={{ p: { xs: 2, md: 3 }, height: { xs: 600, md: 600 }, overflow: 'auto' }}>
          <PrivacyContent />
        </DialogContent>
      )}
    </Dialog>
  );
}


