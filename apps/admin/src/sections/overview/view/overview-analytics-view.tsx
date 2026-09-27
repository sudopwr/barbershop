import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Button from '@mui/material/Button';
import ListItem from '@mui/material/ListItem';
import Skeleton from '@mui/material/Skeleton';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';

import { useAuth } from 'src/auth';
import { useServices, useDashboardStats } from 'src/api/queries';
import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';

import { StatCard } from '../stat-card';
import { AnalyticsCurrentVisits } from '../analytics-current-visits';

// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
  const { admin } = useAuth();
  const { data: stats, isLoading } = useDashboardStats();
  const { data: services = [], isLoading: servicesLoading } = useServices();

  const recent = [...services].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 6);
  const chartSeries = (stats?.servicesByCategory ?? [])
    .filter((c) => c.count > 0)
    .map((c) => ({ label: c.name, value: c.count }));

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Welcome back{admin ? `, ${admin.username}` : ''} 👋
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Live services"
            loading={isLoading}
            value={String(stats?.activeServices ?? 0)}
            caption={`${stats?.totalServices ?? 0} in total`}
            icon={<Iconify icon="solar:scissors-bold-duotone" width={48} />}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Categories"
            color="secondary"
            loading={isLoading}
            value={String(stats?.activeCategories ?? 0)}
            caption={`${stats?.totalCategories ?? 0} in total`}
            icon={<Iconify icon="solar:widget-5-bold-duotone" width={48} />}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Featured"
            color="warning"
            loading={isLoading}
            value={String(stats?.featuredServices ?? 0)}
            caption="Highlighted on the website"
            icon={<Iconify icon="solar:star-bold-duotone" width={48} />}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Average price"
            color="info"
            loading={isLoading}
            value={fCurrency(stats?.averagePrice ?? 0)}
            caption="Across live services"
            icon={<Iconify icon="solar:tag-price-bold-duotone" width={48} />}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          {chartSeries.length > 0 ? (
            <AnalyticsCurrentVisits title="Services by category" chart={{ series: chartSeries }} />
          ) : (
            <Card>
              <CardHeader title="Services by category" />
              <EmptyContent
                title={isLoading ? 'Loading…' : 'Nothing to chart yet'}
                description="Add a category and a few services to see how your menu is split."
              />
            </Card>
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ height: 1 }}>
            <CardHeader
              title="Recently updated"
              subheader="Latest changes to your price list"
              action={
                <Button
                  component={RouterLink}
                  href="/services"
                  size="small"
                  endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
                >
                  All services
                </Button>
              }
            />
            {servicesLoading ? (
              <List>
                {[0, 1, 2].map((i) => (
                  <ListItem key={i}>
                    <Skeleton width="100%" height={40} />
                  </ListItem>
                ))}
              </List>
            ) : recent.length === 0 ? (
              <EmptyContent
                title="No services yet"
                description="Your price list is empty. Start with a category, then add services to it."
                action={
                  <Button component={RouterLink} href="/categories" variant="contained">
                    Add a category
                  </Button>
                }
              />
            ) : (
              <List sx={{ px: 1 }}>
                {recent.map((service) => (
                  <ListItem
                    key={service.id}
                    secondaryAction={
                      <Label color={service.isActive ? 'success' : 'default'}>
                        {service.isActive ? 'Live' : 'Hidden'}
                      </Label>
                    }
                  >
                    <ListItemText
                      primary={service.name}
                      secondary={`${fCurrency(service.price)} · ${service.durationMinutes} min`}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Card>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
