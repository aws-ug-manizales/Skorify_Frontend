'use client';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Pagination from '@mui/material/Pagination';

type Props<T> = {
  items: T[]; // items de la página actual
  page: number; // 1-based
  totalItems: number;
  pageSize: number; // N
  onPageChange: (page: number) => void;
  renderItem: (item: T) => React.ReactNode;
  getKey: (item: T) => string;
  gridSize?: { xs: number; sm?: number; md?: number; lg?: number; xl?: number };
};

const PaginatedMatchesGrid = <T,>({
  items,
  page,
  totalItems,
  pageSize,
  onPageChange,
  renderItem,
  getKey,
  gridSize = { xs: 12, sm: 6, lg: 4 },
}: Props<T>) => {
  const safePageSize = Math.max(1, pageSize);
  const totalPages = Math.max(1, Math.ceil(totalItems / safePageSize));
  const showPagination = totalItems > safePageSize;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Grid container spacing={3}>
        {items.map((item) => (
          <Grid key={getKey(item)} size={gridSize}>
            {renderItem(item)}
          </Grid>
        ))}
      </Grid>

      {showPagination ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1 }}>
          <Pagination
            count={totalPages}
            page={Math.min(page, totalPages)}
            onChange={(_, next) => onPageChange(next)}
            color="primary"
            shape="rounded"
          />
        </Box>
      ) : null}
    </Box>
  );
};

export default PaginatedMatchesGrid;

