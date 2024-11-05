import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui';
import React from 'react';

import { PaginationType } from '@/libs/types/responseTypes';

const PaginationMain: React.FC<{
  PaginationDetails: PaginationType;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}> = ({ PaginationDetails, setPage }) => {
  const { TotalPages, Page } = PaginationDetails;

  const handlePageChange = (page: number) => {
    // Ensure the new page is within bounds
    if (page >= 1 && page <= TotalPages) {
      setPage(page);
    }
  };

  return (
    <div className="my-5">
      {PaginationDetails.TotalPages > 0 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(Page - 1);
                }}
                isActive={Page !== 1}
              />
            </PaginationItem>

            {/* Render the page numbers */}
            {[...Array(TotalPages)].map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  href="#"
                  isActive={index + 1 === Page}
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(index + 1);
                  }}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(Page + 1);
                }}
                isActive={Page !== TotalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default PaginationMain;
