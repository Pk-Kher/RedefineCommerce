import React, { useEffect, useState } from "react";
import ColorService from "services/admin/color/ColorService";
import Create from "../create/Create";
import ConfirmDelete from "components/common/modals/ConfirmDelete";
import Messages from "components/common/alerts/messages/Index";
import { serverError } from "services/common/helper/Helper";
import { RecStatusValuebyName } from "global/Enum";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { useDispatch, useSelector } from "react-redux";
import { ValidationMsgs } from "global/ValidationMessages";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";

const List = () => {
  const permission = useSelector(store => store.permission);
  const [colors, setColors] = useState([]);
  const [deleteData, setDeleteData] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const dispatch = useDispatch();
  const location = useSelector((store) => store?.location);
  const [openModal, setOpenModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editColor, setEditColor] = useState({});

  const fetchAllColors = () => {
    dispatch(setAddLoading(true))

    ColorService.getColors({
      args: {
        pageIndex: 0,
        pageSize: 1000,
        pagingStrategy: 0,
        sortingOptions: [],
        filteringOptions: [],
      },
    }).then((color) => {
      setColors(color.data.data.items);
      dispatch(setAddLoading(false))

    }).catch(() => {
      dispatch(setAddLoading(false))

    })
  };

  const handleDelete = (colorData) => {
    dispatch(setAddLoading(true))

    const object = {
      id: colorData.id,
      status: RecStatusValuebyName.Archived,
      rowVersion: colorData.rowVersion,
    };

    ColorService.updateStatus({
      args: { ...object, ...location },
    })
      .then((response) => {
        if (response.data.success) {
          dispatch(
            setAlertMessage({
              view: true,
              type: "success",
              message: ValidationMsgs.color.colorDeleted,
            })
          );
          fetchAllColors();
          setOpenDeleteModal(false);
        } else {
          dispatch(
            setAlertMessage({
              view: true,
              type: "danger",
              message: serverError(response),
            })
          );
          setOpenDeleteModal(false);
          dispatch(setAddLoading(false))

        }
      })
      .catch((errors) => {
        dispatch(
          setAlertMessage({
            view: true,
            type: "danger",
            message: ValidationMsgs.color.colorNotDeleted,
          })
        );
        setOpenDeleteModal(false);
        dispatch(setAddLoading(false))

      });
  };

  const fetchColorData = (id) => {
    if (id !== null) {
      dispatch(setAddLoading(true))
      ColorService.getColorByID(id).then((color) => {
        setEditColor({
          id: color.data.data.id,
          name: color.data.data.name,
          hexCode: color.data.data.hexCode,
          borderColor: color.data.data.borderColor,
          textColor: color.data.data.textColor,
          recStatus: color.data.data.recStatus,
          rowVersion: color.data.data.rowVersion,
        });
        dispatch(setAddLoading(false))
        setOpenModal(true);

      }).catch(() => {
        dispatch(setAddLoading(false))
      })
    } else {
      setEditColor({});
    }
  };

  useEffect(() => {
    fetchAllColors();
  }, []);

  return (
    <>
      <title>Color List</title>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="col-span-full w-full flex justify-between mb-8">
          <div className="col-span-full w-full flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl text-gray-800 font-bold">
              Color Master
            </h1>
            {(permission?.isEdit || permission?.isDelete) && <div className="flex flex-wrap sm:auto-cols-max gap-2">
              <button
                className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
                onClick={() => {
                  setEditId(null)
                  setEditColor({})
                  setOpenModal(true);

                }}
              >
                <span className="ml-1">Add Color</span>
              </button>
            </div>}
          </div>
        </div>
        <Messages />
        <div className="bg-white w-full shadow-xxl rounded-md mb-8">
          <div className="grid grid-cols-6 gap-6 px-6 py-6 mb-4">
            {colors.map((color, index) => {
              return (
                <div key={index} className="relative">
                  {color.recStatus === RecStatusValuebyName.Inactive &&
                    <button className="inline-block w-6 h-6 text-white cursor-pointer absolute left-2 top-2" style={{
                      color: color.textColor,
                    }}>
                      <span className="material-icons-outlined">disabled_visible</span>
                    </button>
                  }
                  {(permission?.isEdit || permission?.isDelete) &&
                    <>
                      <button
                        type="button"
                        className="inline-block w-6 h-6 cursor-pointer absolute left-2 bottom-2"
                        style={{
                          color: color.textColor,
                        }}
                        onClick={() => {
                          setEditId(color.id)
                          fetchColorData(color.id);
                        }}
                      >
                        <span className="material-icons-outlined">edit</span>
                      </button>
                      {(color.recStatus !== RecStatusValuebyName.Archived && permission?.isDelete) && (
                        <button
                          type="button"
                          className="inline-block w-6 h-6 cursor-pointer absolute right-2 bottom-2"
                          style={{
                            color: color.textColor,
                          }}
                          onClick={() => {
                            setDeleteData(color);
                            setOpenDeleteModal(true);
                          }}
                        >
                          <span className="material-icons-outlined">delete</span>
                        </button>
                      )}
                    </>}

                  <div
                    key={index}
                    className="flex justify-center items-center text-white border border-gray-500 h-32"
                    style={{
                      backgroundColor: color.hexCode,
                      color: color.textColor,
                      borderColor: color.borderColor,
                    }}
                  >
                    {color.name}
                  </div>
                </div>
              );
            })}

            <Create
              colors={colors}
              setColors={setColors}
              fetchAllColors={fetchAllColors}
              openModal={openModal}
              setOpenModal={setOpenModal}
              fetchColorData={fetchColorData}
              editId={editId}
              setEditId={setEditId}
              editColor={editColor}
              setEditColor={setEditColor}
            />


            <ConfirmDelete
              handleDelete={handleDelete}
              data={deleteData}
              message={ValidationMsgs.color.colorPermanentDelete}
              title={"Delete"}
              openDeleteModal={openDeleteModal}
              setOpenDeleteModal={setOpenDeleteModal}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default List;
