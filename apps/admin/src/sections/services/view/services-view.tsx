import type { Service } from 'src/api';

import { useMemo, useState, useDeferredValue } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Skeleton from '@mui/material/Skeleton';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';

import { ApiError } from 'src/lib/http';
import { DashboardContent } from 'src/layouts/dashboard';
import {
  useServices,
  useCategories,
  useSaveService,
  useDeleteService,
  useToggleService,
} from 'src/api/queries';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { useNotify } from 'src/components/snackbar';
import { Scrollbar } from 'src/components/scrollbar';
import { PageHeader } from 'src/components/page-header';
import { EmptyContent } from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/confirm-dialog';

import { ServiceFormDialog } from '../service-form-dialog';

// ----------------------------------------------------------------------

type StatusFilter = 'all' | 'active' | 'hidden';

export function ServicesView() {
  const notify = useNotify();

  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const deferredSearch = useDeferredValue(search);
  const filters = {
    search: deferredSearch || undefined,
    categoryId: categoryId || undefined,
    isActive: status === 'all' ? undefined : status === 'active',
  };

  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const { data: services = [], isLoading, isError, refetch } = useServices(filters);
  const save = useSaveService();
  const toggle = useToggleService();
  const remove = useDeleteService();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [deleting, setDeleting] = useState<Service | null>(null);

  const categoryName = useMemo(() => new Map(categories.map((c) => [c.id, c.name])), [categories]);
  const paged = services.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const hasFilters = !!(search || categoryId || status !== 'all');

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const quickUpdate = async (service: Service, changes: Partial<Service>, message: string) => {
    try {
      await toggle.mutateAsync({ id: service.id, changes });
      notify(message);
    } catch (error) {
      notify(error instanceof ApiError ? error.message : 'Could not update service', 'error');
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      await remove.mutateAsync(deleting.id);
      notify(`Deleted "${deleting.name}"`);
    } catch (error) {
      notify(error instanceof ApiError ? error.message : 'Could not delete service', 'error');
    } finally {
      setDeleting(null);
    }
  };

  const renderEmpty = () => {
    if (isError) {
      return (
        <EmptyContent title="Couldn't load services" action={<Button onClick={() => refetch()}>Try again</Button>} />
      );
    }
    if (hasFilters) {
      return <EmptyContent title="No matches" description="Try a different search or clear the filters." />;
    }
    if (!categoriesLoading && categories.length === 0) {
      return (
        <EmptyContent
          title="Create a category first"
          description="Every service belongs to a category, like Haircuts or Beard & Shave."
          action={
            <Button component={RouterLink} href="/categories" variant="contained">
              Go to categories
            </Button>
          }
        />
      );
    }
    return (
      <EmptyContent
        title="No services yet"
        description="Add your first service with its price and duration — it appears on the website right away."
        action={
          <Button variant="contained" onClick={openCreate}>
            Add a service
          </Button>
        }
      />
    );
  };

  return (
    <DashboardContent>
      <PageHeader
        title="Services"
        description="Your price list. Hidden services stay here but don't show on the website."
        action={
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={openCreate}
            disabled={categories.length === 0}
          >
            New service
          </Button>
        }
      />

      <Card>
        <Box sx={{ p: 2.5, gap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder="Search services…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            sx={{ flex: '1 1 240px' }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              },
              htmlInput: { 'aria-label': 'Search services' },
            }}
          />
          <TextField
            select
            size="small"
            label="Category"
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value);
              setPage(0);
            }}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">All categories</MenuItem>
            {categories.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            size="small"
            label="Status"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as StatusFilter);
              setPage(0);
            }}
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="active">Visible</MenuItem>
            <MenuItem value="hidden">Hidden</MenuItem>
          </TextField>
        </Box>

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 900 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Service</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Duration</TableCell>
                  <TableCell align="center">Featured</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading &&
                  [0, 1, 2, 3].map((i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={7}>
                        <Skeleton height={44} />
                      </TableCell>
                    </TableRow>
                  ))}

                {!isLoading && services.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7}>{renderEmpty()}</TableCell>
                  </TableRow>
                )}

                {paged.map((service) => (
                  <TableRow hover key={service.id}>
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar variant="rounded" src={service.imageUrl || undefined} sx={{ bgcolor: 'primary.lighter' }}>
                          <Iconify icon="solar:scissors-bold-duotone" sx={{ color: 'primary.main' }} />
                        </Avatar>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography variant="subtitle2" noWrap>
                            {service.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap component="div">
                            {service.description || '—'}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>{categoryName.get(service.categoryId) ?? '—'}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>
                      {fCurrency(service.price)}
                    </TableCell>
                    <TableCell align="right">{service.durationMinutes} min</TableCell>
                    <TableCell align="center">
                      <Tooltip title={service.isFeatured ? 'Remove from featured' : 'Feature on home page'}>
                        <IconButton
                          aria-label={`${service.isFeatured ? 'Unfeature' : 'Feature'} ${service.name}`}
                          onClick={() =>
                            quickUpdate(
                              service,
                              { isFeatured: !service.isFeatured },
                              service.isFeatured ? 'Removed from featured' : 'Featured on the home page'
                            )
                          }
                          sx={{ color: service.isFeatured ? 'warning.main' : 'text.disabled' }}
                        >
                          <Iconify icon={service.isFeatured ? 'solar:star-bold' : 'solar:star-bold-duotone'} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Switch
                          size="small"
                          checked={service.isActive}
                          onChange={() =>
                            quickUpdate(
                              service,
                              { isActive: !service.isActive },
                              `"${service.name}" is now ${service.isActive ? 'hidden' : 'visible'}`
                            )
                          }
                          slotProps={{ input: { 'aria-label': `Toggle ${service.name} visibility` } }}
                        />
                        <Label color={service.isActive ? 'success' : 'default'}>
                          {service.isActive ? 'Visible' : 'Hidden'}
                        </Label>
                      </Stack>
                    </TableCell>
                    <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                      <Tooltip title="Edit">
                        <IconButton
                          aria-label={`Edit ${service.name}`}
                          onClick={() => {
                            setEditing(service);
                            setFormOpen(true);
                          }}
                        >
                          <Iconify icon="solar:pen-bold" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton aria-label={`Delete ${service.name}`} color="error" onClick={() => setDeleting(service)}>
                          <Iconify icon="solar:trash-bin-trash-bold" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={page}
          count={services.length}
          rowsPerPage={rowsPerPage}
          onPageChange={(_, next) => setPage(next)}
          rowsPerPageOptions={[10, 25, 50]}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Card>

      <ServiceFormDialog
        open={formOpen}
        service={editing}
        categories={categories}
        defaultCategoryId={categoryId || undefined}
        onClose={() => setFormOpen(false)}
        onSubmit={async (input) => {
          await save.mutateAsync({ id: editing?.id, input });
          notify(editing ? 'Service updated' : 'Service created');
        }}
      />

      <ConfirmDialog
        open={!!deleting}
        title="Delete service?"
        content={`"${deleting?.name}" will be removed from your price list permanently.`}
        loading={remove.isPending}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
      />
    </DashboardContent>
  );
}
