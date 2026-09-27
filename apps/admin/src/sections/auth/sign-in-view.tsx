import { z } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { ApiError } from 'src/lib/http';

import { Iconify } from 'src/components/iconify';

import { useAuth } from 'src/auth';

// ----------------------------------------------------------------------

const schema = z.object({
  username: z.string().trim().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

type FormValues = z.infer<typeof schema>;

export function SignInView() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { username: '', password: '' } });

  // On success the GuestGuard redirects to the dashboard (or ?returnTo)
  const onSubmit = handleSubmit(async ({ username, password }) => {
    setServerError(null);
    try {
      await login(username, password);
    } catch (error) {
      setServerError(error instanceof ApiError ? error.message : 'Sign in failed. Please try again.');
    }
  });

  return (
    <>
      <Box sx={{ gap: 1.5, display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 5 }}>
        <Typography variant="h5">Admin sign in</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
          Manage the services and prices shown on your website.
        </Typography>
      </Box>

      <Box component="form" noValidate onSubmit={onSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {serverError && (
          <Alert severity="error" role="alert">
            {serverError}
          </Alert>
        )}

        <TextField
          fullWidth
          label="Username"
          autoComplete="username"
          autoFocus
          {...register('username')}
          error={!!errors.username}
          helperText={errors.username?.message}
          slotProps={{ inputLabel: { shrink: true } }}
        />

        <TextField
          fullWidth
          label="Password"
          autoComplete="current-password"
          type={showPassword ? 'text' : 'password'}
          {...register('password')}
          error={!!errors.password}
          helperText={errors.password?.message}
          slotProps={{
            inputLabel: { shrink: true },
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        <Button fullWidth size="large" type="submit" color="inherit" variant="contained" loading={isSubmitting}>
          Sign in
        </Button>
      </Box>
    </>
  );
}
