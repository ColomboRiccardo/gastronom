"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ListPaginationProps {
  page: number;
  totalPages: number;
  buildHref?: (page: number) => string;
  onPageChange?: (page: number) => void;
  className?: string;
}

const ListPagination = ({
  page,
  totalPages,
  buildHref,
  onPageChange,
  className = "",
}: ListPaginationProps) => {
  if (totalPages <= 1) return null;

  const prevDisabled = page <= 1;
  const nextDisabled = page >= totalPages;

  const navButtonClass = "gap-1 font-body";

  return (
    <div className={`flex items-center justify-center gap-4 mt-8 ${className}`.trim()}>
      {buildHref ? (
        <Button asChild variant="outline" size="sm" className={navButtonClass} disabled={prevDisabled}>
          <Link href={prevDisabled ? "#" : buildHref(page - 1)} aria-disabled={prevDisabled}>
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Link>
        </Button>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className={navButtonClass}
          disabled={prevDisabled}
          onClick={() => onPageChange?.(page - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
      )}

      <span className="text-sm text-muted-foreground font-body">
        Page {page} of {totalPages}
      </span>

      {buildHref ? (
        <Button asChild variant="outline" size="sm" className={navButtonClass} disabled={nextDisabled}>
          <Link href={nextDisabled ? "#" : buildHref(page + 1)} aria-disabled={nextDisabled}>
            Next
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className={navButtonClass}
          disabled={nextDisabled}
          onClick={() => onPageChange?.(page + 1)}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default ListPagination;
