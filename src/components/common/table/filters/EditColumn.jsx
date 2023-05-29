import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const EditColumn = (props) => {
  const [showEditColumnModel, setEditColumnModel] = useState(false);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    setColumns(props.allColumns);
  }, [props.columns, props.allColumns]);

  const showEditColumnModelHandler = () => {
    setEditColumnModel(!showEditColumnModel);
  };

  const onDragEndHandler = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) {
      return;
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    const newColumnsOrder = Array.from(columns);
    newColumnsOrder.splice(source.index, 1);
    newColumnsOrder.splice(destination.index, 0, columns[draggableId]);
    setColumns(newColumnsOrder);
    props.changeColumnFormat(newColumnsOrder);
  };
  const editColumnSaveHandler = () => {
    props.saveFilterOptionsHandler();
    setEditColumnModel(!showEditColumnModel);
  };

  const [search, setSearch] = useState("");

  return (
    <>
      <div className="relative inline-flex" x-data="{ modalOpen: false }">
        <button
          onClick={showEditColumnModelHandler}
          className="flex flex-wrap items-center text-sm px-3 py-2 bg-white border border-neutral-200 text-gray-500 hover:text-gray-700 rounded-md shadow-sm "
          aria-controls="basic-modal"
        >
          <span className="material-icons-outlined">view_week</span>
          <span className="ml-1">Edit Columns</span>
          <wbr />
        </button>
        <div
          onClick={showEditColumnModelHandler}
          className="fixed inset-0 bg-slate-900 bg-opacity-30 z-50 transition-opacity"
          aria-hidden="true"
          style={{ display: !showEditColumnModel && "none" }}
        />
        <div
          id="basic-modal"
          className="fixed inset-0 z-50 overflow-hidden flex items-center my-4 justify-center transform px-4 sm:px-6"
          role="dialog"
          aria-modal="true"
          style={{ display: !showEditColumnModel && "none" }}
        >
          <div className="bg-white rounded shadow-lg overflow-auto max-w-lg w-full max-h-full">
            {/* Modal header */}
            <div className="px-5 py-3 border-b border-neutral-200">
              <div className="flex justify-between items-center">
                <div className="font-semibold text-gray-800">Edit Columns</div>
                <button
                  onClick={showEditColumnModelHandler}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <div className="sr-only">Close</div>
                  <svg className="w-4 h-4 fill-current">
                    <path d="M7.95 6.536l4.242-4.243a1 1 0 111.415 1.414L9.364 7.95l4.243 4.242a1 1 0 11-1.415 1.415L7.95 9.364l-4.243 4.243a1 1 0 01-1.414-1.415L6.536 7.95 2.293 3.707a1 1 0 011.414-1.414L7.95 6.536z"></path>
                  </svg>
                </button>
              </div>
            </div>
            {/* Modal content */}
            <div className="px-5 pt-4 pb-1">
              <div className="text-sm flex flex-wrap -mx-4">
                <div className="w-full lg:w-1/2 px-4 border-r border-gray-300">
                  <div className="relative mb-2">
                    <div className="absolute h-10 mt-0 left-0 top-0 flex items-center">
                      <svg
                        className="h-4 pl-4 fill-current text-gray-600"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"></path>
                      </svg>
                    </div>
                    <input
                      type="search"
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="search"
                      className="block w-full bg-[#f7f7fa] border-neutral-200 hover:border-neutral-300 focus:border-neutral-100 focus:ring-neutral-300 focus:shadow-lg pl-10 pr-2 py-2 rounded-md"
                    />
                  </div>
                  <ul className="mb-4">
                    {props.allColumns &&
                      props.allColumns.map((column, index) => {
                        if (
                          (search === "" ||
                            column.id
                              .toString()
                              .toLowerCase()
                              .includes(search.toLowerCase())) && column.id !== "rowSelection"
                        ) {
                          return (
                            <li
                              className={`py-1 px-3 ${column.disableShowHide && "opacity-50"
                                }`}
                              key={index}
                            >
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  {...column.getToggleHiddenProps()}
                                  disabled={column.disableShowHide}
                                  className="form-checkbox"
                                />
                                <span className="text-sm font-medium ml-2">
                                  {/* {column.id !== "rowSelection" ? ( */}
                                  {column.id ? column.id.toUpperCase().replaceAll("_", " ")/* column.render("Header") */ : ""}
                                  {/* : "CHECKBOX"} */}
                                </span>
                              </label>
                            </li>
                          );
                        }
                        return "";
                      })}
                  </ul>
                </div>
                <div className="w-full lg:w-1/2 px-4">
                  <DragDropContext onDragEnd={onDragEndHandler}>
                    <Droppable droppableId={"a"}>
                      {(provided) => (
                        <div
                          className="overflow-auto h-full"
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          {columns.map((value, index) => {
                            if (value.id !== "rowSelection" && value.isVisible && !value?.disableShowHide) {
                              return (
                                <Draggable
                                  draggableId={index.toString()}
                                  index={index}
                                  key={index}
                                  isDragDisabled={
                                    ((value.id === "rowSelection" || !value.isVisible))
                                  }
                                >
                                  {(provided, snapshot) => {
                                    return (
                                      <div
                                        {...provided.draggableProps}
                                        ref={provided.innerRef}
                                        className={`py-1 px-2 border mt-2 flex items-center relative text-sm ${snapshot.isDragging &&
                                          "border-1 border-blue-500"
                                          } ${value.id === "rowSelection" ||
                                            !value.isVisible
                                            ? "bg-gray-100"
                                            : "bg-white"
                                          }`}
                                      >
                                        <span
                                          {...provided.dragHandleProps}
                                          className="material-icons-outlined cursor-pointer inline-block"
                                        >
                                          drag_indicator
                                        </span>
                                        {value.id !== "rowSelection"
                                          ? value.id
                                            ? value.id
                                              .toUpperCase()
                                              .replaceAll("_", " ")
                                            : ""
                                          : "CHECKBOX"}
                                      </div>
                                    );
                                  }}
                                </Draggable>
                              );
                            } else if (value.id !== "rowSelection" && value.isVisible) {
                              return <div className={`py-1 px-2 border mt-2 flex items-center relative text-sm `} key={index}>
                                {value.id !== "rowSelection"
                                  ? value.id
                                    ? value.id
                                      .toUpperCase()
                                      .replaceAll("_", " ")
                                    : ""
                                  : "CHECKBOX"}
                              </div>;
                            }
                            return "";
                          })}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </div>
              </div>
            </div>
            {/* Modal footer */}
            <div className="px-5 py-4 sticky bottom-0 bg-white hidden">
              <div className="flex flex-wrap justify-end space-x-2">
                <button
                  className="btn border-gray-300 hover:border-neutral-400 text-gray-500"
                  onClick={showEditColumnModelHandler}
                >
                  Close
                </button>
                <button
                  className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
                  onClick={editColumnSaveHandler}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditColumn;
