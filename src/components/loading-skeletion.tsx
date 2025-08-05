import { Skeleton } from "./ui/skeleton";
import { TableCell, TableRow } from "./ui/table";

interface Props {
  columns?: number;
}

function LoadingSkeletion({ columns = 5 }: Props) {
  return (
    <>
      {Array.from(Array(6)).map((_, i) => (
        <TableRow key={i} className="*:py-2">
          {Array.from(Array(columns)).map((_, j) => (
            <TableCell key={`cell-${i}-${j}`}>
              <Skeleton className="w-full h-[41px]" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

export default LoadingSkeletion;
