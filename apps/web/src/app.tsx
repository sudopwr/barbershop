import Box from '@mui/material/Box';

import { Header } from 'src/layout/header';
import { Footer } from 'src/layout/footer';
import { useCatalog } from 'src/hooks/use-catalog';
import { Hero, Visit, WhyUs, Catalog, Featured } from 'src/sections';

export default function App() {
  const catalog = useCatalog();

  return (
    <>
      <Header />
      <Box component="main">
        <Hero catalog={catalog.data} />
        <Catalog status={catalog.status} categories={catalog.data?.categories ?? []} onRetry={catalog.retry} />
        <Featured services={catalog.data?.featured ?? []} />
        <WhyUs />
        <Visit />
      </Box>
      <Footer />
    </>
  );
}
