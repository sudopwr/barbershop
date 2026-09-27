import type { Category } from 'src/api';

import { useState } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import Skeleton from '@mui/material/Skeleton';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';

import { ApiError } from 'src/lib/http';
import { DashboardContent } from 'src/layouts/dashboard';
import { useCategories, useSaveCategory, useDeleteCategory } from 'src/api/queries';

import { Label } from 'src/components/label';
import { useNotify } from 'src/components/snackbar';
import { Scrollbar } from 'src/components/scrollbar';
import { PageHeader } from 'src/components/page-header';
import { EmptyContent } from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/confirm-dialog';
import { Iconify, CategoryIcon } from 'src/components/iconify';

import { CategoryFormDialog } from '../category-form-dialog';

// ----------------------------------------------------------------------

export function CategoriesView() {
  const notify = useNotify();
  const { data: categories = [], isLoading, isError, refetch } = useCategories();
  const save = useSaveCategory();
  const remove = useDeleteCategory();

  const [editing, setEditing] = useState<Category | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleting, setDeleting] = useState<Category | null>(null);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (category: Category) => {
    setEditing(category);
    setFormOpen(true);
  };

  const toggleActive = async (category: Category) => {
    try {
      await save.mutateAsync({ id: category.id, input: { isActive: !category.isActive } });
      notify(`"${category.name}" is now ${category.isActive ? 'hidden' : 'visible'}`);
    } catch (error) {
      notify(error instanceof ApiError ? error.message : 'Could not update category', 'error');
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      await remove.mutateAsync(deleting.id);
      notify(`Deleted "${deleting.name}"`);
    } catch (error) {
      notify(error instanceof ApiError ? error.message : 'Could not delete category', 'error');
    } finally {
      setDeleting(null);
    }
  };

  const renderBody = () => {
    if (isLoading) {
      return [0, 1, 2].map((i) => (
        <TableRow key={i}>
          <TableCell colSpan={6}>
            <Skeleton height={40} />
          </TableCell>
        </TableRow>
      ));
    }

    if (isError || categories.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={6}>
            {isError ? (
              <EmptyContent
                title="Couldn't load categories"
                action={<Button onClick={() => refetch()}>Try again</Button>}
              />
            ) : (
              <EmptyContent
                title="No categories yet"
                description="Categories group your services on the website, e.g. Haircuts, Beard & Shave, Grooming."
                action={
                  <Button variant="contained" onClick={openCreate}>
                    Create your first category
                  </Button>
                }
              />
            )}
          </TableCell>
        </TableRow>
      );
    }

    return categories.map((category) => (
      <TableRow hover key={category.id}>
        <TableCell>
          <Stack direction="row" spacing={2} alignItems="center">
            <CategoryIcon icon={category.icon} width={28} sx={{ color: 'primary.main' }} />
            <div>
              <Typography variant="subtitle2">{category.name}</Typography>
              <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                /{category.slug}
              </Typography>
            </div>
          </Stack>
        </TableCell>
        <TableCell sx={{ maxWidth: 320, color: 'text.secondary' }}>
          <Typography variant="body2" noWrap>
            {category.description || '—'}
          </Typography>
        </TableCell>
        <TableCell align="center">{category.serviceCount ?? 0}</TableCell>
        <TableCell align="center">{category.sortOrder}</TableCell>
        <TableCell>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Switch
              size="small"
              checked={category.isActive}
              onChange={() => toggleActive(category)}
              slotProps={{ input: { 'aria-label': `Toggle ${category.name} visibility` } }}
            />
            <Label color={category.isActive ? 'success' : 'default'}>
              {category.isActive ? 'Visible' : 'Hidden'}
            </Label>
          </Stack>
        </TableCell>
        <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
          <Tooltip title="Edit">
            <IconButton aria-label={`Edit ${category.name}`} onClick={() => openEdit(category)}>
              <Iconify icon="solar:pen-bold" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              aria-label={`Delete ${category.name}`}
              color="error"
              onClick={() => setDeleting(category)}
            >
              <Iconify icon="solar:trash-bin-trash-bold" />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <DashboardContent>
      <PageHeader
        title="Categories"
        description="Group your services the way customers browse them."
        action={
          <Button variant="contained" color="inherit" startIcon={<Iconify icon="mingcute:add-line" />} onClick={openCreate}>
            New category
          </Button>
        }
      />

      <Card>
        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 760 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Category</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell align="center">Services</TableCell>
                  <TableCell align="center">Order</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>{renderBody()}</TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
      </Card>

      <CategoryFormDialog
        open={formOpen}
        category={editing}
        onClose={() => setFormOpen(false)}
        onSubmit={async (input) => {
          await save.mutateAsync({ id: editing?.id, input });
          notify(editing ? 'Category updated' : 'Category created');
        }}
      />

      <ConfirmDialog
        open={!!deleting}
        title="Delete category?"
        content={
          deleting?.serviceCount
            ? `"${deleting.name}" still has ${deleting.serviceCount} service(s). Move or delete them first.`
            : `"${deleting?.name}" will be removed permanently.`
        }
        loading={remove.isPending}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
      />
    </DashboardContent>
  );
}
