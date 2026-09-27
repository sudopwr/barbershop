import type { Category, CategoryInput } from 'src/api';

import { z } from 'zod';
import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Switch from '@mui/material/Switch';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import ToggleButton from '@mui/material/ToggleButton';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import FormControlLabel from '@mui/material/FormControlLabel';

import { applyServerErrors } from 'src/lib/form-errors';

import { CATEGORY_ICONS, CategoryIcon } from 'src/components/iconify';

// ----------------------------------------------------------------------

export const categorySchema = z.object({
  name: z.string().trim().min(2, 'At least 2 characters').max(60, 'At most 60 characters'),
  description: z.string().trim().max(300, 'At most 300 characters'),
  icon: z.string(),
  sortOrder: z.coerce.number().int('Whole numbers only').min(0).max(9999),
  isActive: z.boolean(),
});

type FormValues = z.infer<typeof categorySchema>;

const EMPTY: FormValues = { name: '', description: '', icon: CATEGORY_ICONS[0], sortOrder: 0, isActive: true };

type Props = {
  open: boolean;
  category?: Category | null;
  onClose: () => void;
  onSubmit: (input: CategoryInput) => Promise<unknown>;
};

export function CategoryFormDialog({ open, category, onClose, onSubmit }: Props) {
  const [formError, setFormError] = useState<string | null>(null);
  const isEdit = !!category;

  const {
    control,
    register,
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(categorySchema), defaultValues: EMPTY });

  useEffect(() => {
    if (!open) return;
    setFormError(null);
    reset(
      category
        ? {
            name: category.name,
            description: category.description,
            icon: category.icon || EMPTY.icon,
            sortOrder: category.sortOrder,
            isActive: category.isActive,
          }
        : EMPTY
    );
  }, [open, category, reset]);

  const submit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      await onSubmit(values);
      onClose();
    } catch (error) {
      setFormError(applyServerErrors(error, setError, ['name', 'description', 'icon', 'sortOrder']));
    }
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <Box component="form" noValidate onSubmit={submit}>
        <DialogTitle>{isEdit ? 'Edit category' : 'New category'}</DialogTitle>

        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: '8px !important' }}>
          {formError && <Alert severity="error">{formError}</Alert>}

          <TextField
            label="Name"
            placeholder="e.g. Haircuts"
            autoFocus
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          <TextField
            label="Description"
            placeholder="Short line shown under the category on the website"
            multiline
            minRows={2}
            {...register('description')}
            error={!!errors.description}
            helperText={errors.description?.message}
          />

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Icon
            </Typography>
            <Controller
              name="icon"
              control={control}
              render={({ field }) => (
                <Box
                  role="radiogroup"
                  aria-label="Category icon"
                  sx={{ display: 'grid', gap: 1, gridTemplateColumns: 'repeat(auto-fill, minmax(48px, 1fr))' }}
                >
                  {CATEGORY_ICONS.map((icon) => (
                    <Tooltip key={icon} title={icon.replace('mdi:', '').replace(/-/g, ' ')}>
                      <ToggleButton
                        value={icon}
                        role="radio"
                        aria-checked={field.value === icon}
                        aria-label={icon}
                        selected={field.value === icon}
                        onChange={() => field.onChange(icon)}
                        color="primary"
                        sx={{ height: 48 }}
                      >
                        <CategoryIcon icon={icon} width={24} />
                      </ToggleButton>
                    </Tooltip>
                  ))}
                </Box>
              )}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
              label="Display order"
              type="number"
              sx={{ width: 160 }}
              {...register('sortOrder')}
              error={!!errors.sortOrder}
              helperText={errors.sortOrder?.message ?? 'Lower shows first'}
              slotProps={{ htmlInput: { min: 0, step: 1 } }}
            />

            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  label="Visible on website"
                  control={<Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />}
                />
              )}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" color="inherit" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" loading={isSubmitting}>
            {isEdit ? 'Save changes' : 'Create category'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
