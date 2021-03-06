import React from 'react';
//<Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} length={customers.length} onPageChanged={handlePageChange} />
const Pagination = ({currentPage , itemsPerPages , length , onPageChanged }) => {
    const pageCount = Math.ceil(length / itemsPerPages);
    const pages = [];
    for (let i = 1; i <= pageCount; i++) {
        pages.push(i);
    }
    return (
        <div>
            <ul className="pagination pagination-sm">
                <li className={"page-item" + (currentPage === 1 ? " disabled" : '')}>
                    <button className="page-link" onClick={() => onPageChanged(currentPage - 1)}>
                        &laquo;
                    </button>
                </li>
                {pages.map(page => (
                    <li key={page} className={"page-item" + (currentPage === page && " active")}>
                        <button className="page-link" onClick={() => { onPageChanged(page); }}>{page}</button>
                    </li>
                ))}
                <li className={"page-item" + (currentPage === pageCount ? " disabled" : '')}>
                    <button className="page-link" onClick={() => onPageChanged(currentPage + 1)}>
                        &raquo;
                    </button>
                </li>
            </ul>
        </div>
    );
}

Pagination.getData = (items, currentPage, itemsPerPages) => {
    const start = currentPage * itemsPerPages - itemsPerPages;
    return items.slice(start, start + itemsPerPages);

}

export default Pagination;