import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Pagination,
} from "@shared/ui";
import { useState } from "react";

export const PaginationSection = () => {
  const [page, setPage] = useState(1);
  const [longPage, setLongPage] = useState(17);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Pagination</CardTitle>
        <CardDescription className="text-xs">
          Окно страниц строится из maxVisible; текущая страница зажимается в
          диапазон
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">
            10 страниц, size=sm
          </p>
          <Pagination
            currentPage={page}
            totalPages={10}
            onPageChange={setPage}
            size="sm"
          />
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">
            50 страниц, maxVisible=9, showFirstLast
          </p>
          <Pagination
            currentPage={longPage}
            totalPages={50}
            onPageChange={setLongPage}
            maxVisible={9}
            showFirstLast
            size="sm"
          />
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">
            maxVisible=5, disabled
          </p>
          <Pagination
            currentPage={longPage}
            totalPages={50}
            onPageChange={setLongPage}
            maxVisible={5}
            size="sm"
            disabled
          />
        </div>
      </CardContent>
    </Card>
  );
};
