import React from "react";

export default function GridViewTable({ page, prepareRow, isColspan, colSpan=4, Gap=6 }) {
  return (
    <>
      <div className={`grid grid-cols-${colSpan} gap-${Gap}`} x-data="{ selected: '' }">
        {page.map((row) => {
          prepareRow(row);
          return (
            <div {...row.getRowProps()}>
              {!row.canExpand && isColspan ? (
                // <div colSpan={colSpan}>{row.cells[1].render("Cell")}</div>
                <></>
              ) : (
                row.cells.map((cell, index) => {
                  return (
                    <div key={index} {...cell.getCellProps()}>
                      {cell.render("Cell")}
                    </div>
                  );
                })
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
