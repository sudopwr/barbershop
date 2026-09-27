import type { Service, Category, ServiceInput } from 'src/api';

import { z } from 'zod';
import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Switch from '@mui/material/Switch';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';

import { CONFIG } from 'src/config-global';
import { applyServerErrors } from 'src/lib/form-errors';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

/** Number inputs give strings; an empty one must fail validation instead of becoming 0. */
const toNumber = (value: unknown) => (value === '' || value == null ? undefined : Number(value));

export const serviceSchema = z.object({
  categoryId: z.string().min(1, 'Choose a category'),
  name: z.string().trim().min(2, 'At least 2 characters').max(80, 'At most 80 characters'),
  description: z.string().trim().max(500, 'At most 500 characters'),
  price: z.preprocess(
    toNumber,
    z
      .number({ required_error: 'Enter a price', invalid_type_error: 'Enter a price' })
      .min(0, 'Cannot be negative')
      .max(1_000_000, 'Too high')
  ),
  durationMinutes: z.preprocess(
    toNumber,
    z
      .number({ required_error: 'Enter minutes', invalid_type_error: 'Enter minutes' })
      .int('Whole minutes only')
      .min(5, 'At least 5 minutes')
      .max(480, 'At most 8 hours')
  ),
  imageUrl: z
    .string()
    .trim()
    .refine((v) => v === '' || /^https?:\/\/\S+$/i.test(v), 'Must start with http:// or https://'),
  sortOrder: z.coerce.number().int('Whole numbers only').min(0).max(9999),
  isFeatured: z.boolean(),
  isActive: z.boolean(),
});

type FormValues = z.infer<typeof serviceSchema>;

const FIELDS = ['categoryId', 'name', 'description', 'price', 'durationMinutes', 'imageUrl', 'sortOrder'] as const;

const currencySymbol = () =>
  new Intl.NumberFormat(CONFIG.locale, { style: 'currency', currency: CONFIG.currency })
    .formatToParts(0)
    .find((p) => p.type === 'currency')?.value ?? CONFIG.currency;

type Props = {
  open: boolean;
  service?: Service | null;
  categories: Category[];
  defaultCategoryId?: string;
  onClose: () => void;
  onSubmit: (input: ServiceInput) => Promise<unknown>;
};

export function ServiceFormDialog({ open, service, categories, defaultCategoryId, onClose, onSubmit }: Props) {
  const [formError, setFormError] = useState<string | null>(null);
  const isEdit = !!service;

  const {
    control,
    register,
    reset,
    watch,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(serviceSchema) });

  useEffect(() => {
    if (!open) return;
    setFormError(null);
    reset(
      service
        ? {
            categoryId: service.categoryId,
            name: service.name,
            description: service.description,
            price: service.price,
            durationMinutes: service.durationMinutes,
            imageUrl: service.imageUrl,
            sortOrder: service.sortOrder,
            isFeatured: service.isFeatured,
            isActive: service.isActive,
          }
        : {
            categoryId: defaultCategoryId ?? categories[0]?.id ?? '',
            name: '',
            description: '',
            price: 0,
            durationMinutes: 30,
            imageUrl: '',
            sortOrder: 0,
            isFeatured: false,
            isActive: true,
          }
    );
  }, [open, service, categories, defaultCategoryId, reset]);

  const imageUrl = watch('imageUrl');

  const submit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      await onSubmit(values);
      onClose();
    } catch (error) {
      setFormError(applyServerErrors(error, setError, FIELDS));
    }
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <Box component="form" noValidate onSubmit={submit}>
        <DialogTitle>{isEdit ? 'Edit service' : 'New service'}</DialogTitle>

        <DialogContent sx={{ pt: '8px !important' }}>
          {formError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {formError}
            </Alert>
          )}

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 7 }}>
              <TextField
                fullWidth
                label="Service name"
                placeholder="e.g. Skin Fade"
                autoFocus
                {...register('name')}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 5 }}>
              <Controller
                name="categoryId"
                control={control}
                render={({ field }) => (
                  <TextField
                    select
                    fullWidth
                    label="Category"
                    {...field}
                    value={field.value ?? ''}
                    error={!!errors.categoryId}
                    helperText={errors.categoryId?.message}
                  >
                    {categories.map((c) => (
                      <MenuItem key={c.id} value={c.id}>
                        {c.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                multiline
                minRows={3}
                label="Description"
                placeholder="What's included — shown to customers"
                {...register('description')}
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                type="number"
                label="Price"
                {...register('price')}
                error={!!errors.price}
                helperText={errors.price?.message}
                slotProps={{
                  htmlInput: { min: 0, step: '0.01' },
                  input: { startAdornment: <InputAdornment position="start">{currencySymbol()}</InputAdornment> },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                type="number"
                label="Duration"
                {...register('durationMinutes')}
                error={!!errors.durationMinutes}
                helperText={errors.durationMinutes?.message}
                slotProps={{
                  htmlInput: { min: 5, step: 5 },
                  input: { endAdornment: <InputAdornment position="end">min</InputAdornment> },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                type="number"
                label="Display order"
                {...register('sortOrder')}
                error={!!errors.sortOrder}
                helperText={errors.sortOrder?.message ?? 'Lower shows first'}
                slotProps={{ htmlInput: { min: 0, step: 1 } }}
              />
            </Grid>

            <Grid size={12}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Avatar variant="rounded" src={imageUrl || undefined} sx={{ width: 56, height: 56, mt: 0.5 }}>
                  <Iconify icon="solar:gallery-bold-duotone" />
                </Avatar>
                <TextField
                  fullWidth
                  label="Image URL (optional)"
                  placeholder="https://…"
                  {...register('imageUrl')}
                  error={!!errors.imageUrl}
                  helperText={errors.imageUrl?.message ?? 'Paste a link to a photo of this service'}
                />
              </Box>
            </Grid>

            <Grid size={12} sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    label="Visible on website"
                    control={<Switch checked={!!field.value} onChange={(e) => field.onChange(e.target.checked)} />}
                  />
                )}
              />
              <Controller
                name="isFeatured"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    label="Feature on the home page"
                    control={
                      <Switch
                        color="warning"
                        checked={!!field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    }
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" color="inherit" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" loading={isSubmitting}>
            {isEdit ? 'Save changes' : 'Create service'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
