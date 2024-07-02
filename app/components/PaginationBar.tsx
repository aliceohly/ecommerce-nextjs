import Link from "next/link";

interface PaginationBarProps {
  currentPage: number;
  totalPages: number;
}

export default function PaginationBar({
  currentPage,
  totalPages,
}: PaginationBarProps) {
  const maxPage = Math.min(totalPages, Math.max(currentPage + 2, 5));
  const minPage = Math.max(1, Math.min(currentPage - 2, totalPages - 9));

  const paginationBarItems: JSX.Element[] = [];

  for (let page = minPage; page <= maxPage; page++) {
    paginationBarItems.push(
      <Link
        href={"?page=" + page}
        key={page}
        className={`btn join-item ${currentPage === page ? "btn-active" : ""}`}
      >
        {page}
      </Link>,
    );
  }

  return (
    <>
      <div className="join">{paginationBarItems}</div>
    </>
  );
}
