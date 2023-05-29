/*Component Name: ReactDragDropTable
Component Functional Details:  ReactDragDropTable .
Created By: PK Kher
Created Date: 7/12/2022
Modified By: PK Kher
Modified Date: 7/12/2022 */

import React, { useState, Fragment, useMemo, useEffect } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import TableSearch from "./filters/TableSearch";
import Pagination from "./Pagination";
import { NavLink, useNavigate, useParams, useLocation } from "react-router-dom";

const ReactDragDropTable = ({
  DATA,
  COLUMNS,
  hasNextPage,
  hasPreviousPage,
  pageIndex = 0,
  extraClass,
  isExtraClass = false,
  isSubRow = false,
  pageSize,
  totalCount,
  totalPages = Math.ceil(totalCount / pageSize),
  fetchData,
  setTablePageSize,
  displaySearch = true,
  searchPlaceholder = "Search",
  orderChangeHandler,
  ColumnComponent,
}) => {
  const columns = useMemo(() => (COLUMNS ? COLUMNS : []), [COLUMNS]);
  const data = useMemo(() => (DATA ? DATA : []), [DATA]);
  const [expandAll, setExpandAll] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const { storeName, storeType, storeId } = useParams();

  useEffect(() => {
    fetchData();
  }, [pageSize, fetchData]);

  useEffect(() => {
    setGlobalFilter("")
  }, [storeId]);

  return (
    <>
      <div className="w-full relative">
        <div className="p-5">
          <div className="w-full flex flex-wrap sm:auto-cols-max justify-between gap-2 pb-7">
            {displaySearch && (
              <TableSearch
                filter={globalFilter}
                setFilter={setGlobalFilter}
                placeholderText={searchPlaceholder}
              />
            )}
          </div>
          <div className="m-4 overflow-x-scroll">
            <div className="table-auto w-full text-sm text-[#191919] font-semibold">
              <div className="thead text-sm font-bold uppercase text-[#b3b3b3] pt-2">
                <div
                  className={`grid lg:grid-cols-${columns.length}  md:grid-cols-${columns.length} grid-cols-2 border-t-2`}
                >
                  {columns.map((column, i) => {
                    return (
                      <div className="flex flex-row px-2 py-4" key={i}>
                        {i === 0 && (
                          <div
                            className="leading-none mr-2 w-6 h-6 cursor-pointer transition-all variant-arrow"
                            onClick={() => setExpandAll((prev) => !prev)}
                          >
                            <span className="material-icons-outlined">
                              {expandAll ? "remove" : "add"}
                            </span>
                          </div>
                        )}
                        <div
                          className={`font-semibold text-left ${i === 0 ? "w-screen" : "w-52"
                            } max-w-2xl flex items-center`}
                        >
                          <span>{column.Header}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <NestedColumnDroppable
              data={data}
              recCount={1}
              columns={columns}
              extraClass={extraClass}
              isExtraClass={isExtraClass}
              isSubRow={isSubRow}
              expandAll={expandAll}
              orderChangeHandler={orderChangeHandler}
              ColumnComponent={ColumnComponent}
            />
          </div>
          <Pagination
            totalCount={totalCount}
            pageSize={pageSize}
            totalPages={totalPages}
            pageIndex={pageIndex}
            setTablePageSize={setTablePageSize}
            hasPreviousPage={hasPreviousPage}
            hasNextPage={hasNextPage}
            fetchData={fetchData}
          />
        </div>
      </div>
    </>
  );
};
const NestedColumnDroppable = ({
  index,
  data,
  getParentIds,
  recCount,
  paddingLeft,
  columns,
  extraClass,
  isExtraClass,
  isSubRow,
  expandAll,
  orderChangeHandler,
  ColumnComponent,
}) => {
  const [levelData, setLevelData] = useState([]);
  useEffect(() => setLevelData(data), [data]);
  const handleDragEnd = (e) => {
    if (!e.destination) return;
    let tempData = Array.from(levelData);
    let [source_data] = tempData.splice(e.source.index, 1);
    tempData.splice(e.destination.index, 0, source_data);
    setLevelData(tempData);
    if (orderChangeHandler instanceof Function) {
      orderChangeHandler(e.destination.index, source_data);
    }
  };
  const getParentIdsHandler = () => {
    if (getParentIds instanceof Function) {
      return [index, ...getParentIds()];
    }
    return ["user"];
  };
  return (
    <Fragment key={index}>
      <DragDropContext
        onDragEnd={handleDragEnd}
        className="tbody divide-y divide-slate-200 border-b border-neutral-200"
      >
        <Droppable droppableId={`droppable-${index}`}>
          {(provider, snapshot) => (
            <div
              className={`text-capitalize ${snapshot.isDraggingOver ? "bg-[#f8fafc]" : "bg-white"
                }`}
              ref={provider.innerRef}
              {...provider.droppableProps}
            >
              {levelData?.map((columnValue, index) => (
                <Draggable
                  key={`${index}_${columnValue.id}_${recCount}_uniqueId`}
                  draggableId={`${index}_${columnValue.id}_${recCount}_uniqueId`}
                  index={index}
                >
                  {(provider) => (
                    <Column
                      provider={provider}
                      columnValue={columnValue}
                      index={index}
                      getParentIds={getParentIdsHandler}
                      isExtraClass={isExtraClass}
                      isSubRow={isSubRow}
                      extraClass={extraClass}
                      paddingLeft={paddingLeft}
                      recCount={recCount}
                      columns={columns}
                      expandAll={expandAll}
                      orderChangeHandler={orderChangeHandler}
                      ColumnComponent={ColumnComponent}
                    />
                  )}
                </Draggable>
              ))}
              {provider.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </Fragment>
  );
};
const Column = ({
  provider,
  columnValue,
  index,
  getParentIds,
  paddingLeft,
  recCount,
  columns,
  extraClass,
  isExtraClass,
  isSubRow,
  expandAll,
  orderChangeHandler,
  ColumnComponent,
}) => {
  const [showSubRows, setShowSubRows] = useState(false);
  useEffect(() => {
    setShowSubRows(expandAll);
  }, [expandAll]);
  let allColumns = [];
  allColumns = isSubRow ? columns.slice(0, 1) : columns
  return (
    <Fragment key={index}>
      <div {...provider.draggableProps} ref={provider.innerRef}>
        {ColumnComponent ? (
          <ColumnComponent
            provider={provider}
            columnValue={columnValue}
            index={index}
            getParentIds={getParentIds}
            paddingLeft={paddingLeft}
            recCount={recCount}
            columns={columns}
            expandAll={expandAll}
            orderChangeHandler={orderChangeHandler}
            ColumnComponent={ColumnComponent}
          />
        ) : (
          <div
            className={`${isSubRow ? extraClass : `grid lg:grid-cols-${allColumns.length} md:grid-cols-${allColumns.length} grid-cols-2`} border-t-2`}
          >
            {allColumns.map((column, i) => {
              return (
                <div
                  className={`${i === 0 ? "flex-auto row-start-auto" : ""
                    } px-2 py-4`}
                  key={i}
                >
                  <div
                    className={`${i === 0 ? "flex flex-row " : ""}`}
                    style={{ paddingLeft: `${i === 0 ? paddingLeft : 0}rem` }}
                    key={i}
                  >
                    {i === 0 && (
                      <>
                        <div
                          className="flex items-center mr-2"
                          {...provider.dragHandleProps}
                        >
                          <span className="material-icons-outlined">
                            drag_indicator
                          </span>
                        </div>
                        {((columnValue.subRows && columnValue.subRows.length > 0) || (isExtraClass)) && (
                          <div
                            className="leading-none mr-2 w-6 h-6 cursor-pointer transition-all variant-arrow"
                            onClick={() => setShowSubRows((prev) => !prev)}
                          >
                            <span className="material-icons-outlined">
                              {showSubRows ? "remove" : "add"}
                            </span>
                          </div>
                        )}
                      </>
                    )}
                    {column.Cell ? (
                      <column.Cell
                        value={columnValue[column.accessor]}
                        row={columnValue}
                      />
                    ) : (
                      <div
                        className={`font-semibold text-left max-w-2xl flex items-center`}
                      >
                        <span>{columnValue[column.accessor]}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {columnValue.subRows && columnValue.subRows.length > 0 && showSubRows && (
        <NestedColumnDroppable
          index={index}
          data={columnValue.subRows}
          getParentIds={getParentIds}
          paddingLeft={`${1.25 * recCount}`}
          recCount={recCount + 1}
          extraClass={(isExtraClass) ? extraClass : ''}
          isSubRow={isExtraClass}
          columns={columns}
          expandAll={expandAll}
          orderChangeHandler={orderChangeHandler}
          ColumnComponent={ColumnComponent}
        />
      )}
    </Fragment>
  );
};

export default ReactDragDropTable;
