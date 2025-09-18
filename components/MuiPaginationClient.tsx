'use client';

import React from 'react';
import { Pagination, PaginationItem } from '@mui/material';
import Link from 'next/link';

interface MuiPaginationClientProps {
    totalPages: number;
    currentPage: number;
}

const MuiPaginationClient = ({
    totalPages,
    currentPage,
}: MuiPaginationClientProps) => {
    return (
        <Pagination
            count={totalPages}
            page={currentPage}
            shape="rounded"
            size="large"
            color="primary"
            showFirstButton
            showLastButton
            renderItem={(item: any) => (
                <PaginationItem
                    component={Link}
                    href={item.page === 1 ? `/news` : `/news/page/${item.page}`}
                    {...item}
                />
            )}
        />
    );
};

export default MuiPaginationClient;
