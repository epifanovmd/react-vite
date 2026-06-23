import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Pagination,
} from "@components/ui";
import { FC, useState } from "react";

export const PaginationSection: FC = () => {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Pagination</CardTitle>
        <CardDescription className="text-xs">
          Навигация по страницам
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Pagination
          currentPage={currentPage}
          totalPages={10}
          onPageChange={setCurrentPage}
          size="sm"
        />
      </CardContent>
    </Card>
  );
};
