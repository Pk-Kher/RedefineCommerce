import React, { useState, useEffect } from "react";

import ConfirmDelete from "components/common/modals/ConfirmDelete";
import Image from "components/common/formComponent/Image";
import LogoLocationServices from "services/admin/logolocation/LogoLocationService";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { defaultImage, RecStatusValuebyName } from "global/Enum";
import { useDispatch, useSelector } from "react-redux";
import Actions from "./Actions";
import { serverError } from "services/common/helper/Helper";
import ManageLogoLocation from "./ManageLogoLocationModel";
import Status from "components/common/displayStatus/Status";
import { ValidationMsgs } from "global/ValidationMessages";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";

const LogoLocation = ({
  handleShowAddlogoLocation,
  id,
  getLogoLocationData,
  fetchLogolocationDetails,
  LogoLocationsDetails,
  CreateAndUpdateLogoLocationBrandField,
  setOldBrands,
  OldBrands,
  setopenAddlogoLocationModal
}) => {
  const dispatch = useDispatch();
  const [handleLogoLocationModal, setHandleLogoLocationModal] = useState(false);
  const location = useSelector((store) => store?.location);
  const [logoLocationDetailsId, setLogoLocationDetailsId] = useState();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [LogoLocationDetailData, setLogoLocationDetailData] = useState({});
  const [isDesabledAddCatalog, setisDesabledAddCatalog] = useState("");

  const handleUpdateLogoLocationDetails = (logoDetailData) => {
    dispatch(setAddLoading(true))

    const object = {
      id: logoDetailData.id,
      status: RecStatusValuebyName.Archived,
      rowVersion: logoDetailData.rowVersion,
    };

    const { browser, ...allLocationData } = location

    LogoLocationServices.updateLogoLocationDetailStatus({
      ...object,
      ...allLocationData,
    })
      .then((response) => {
        if (response.data.success) {
          dispatch(
            setAlertMessage({
              type: "success",
              message: ValidationMsgs.logoLocationDetails.logoLocationDetailsDeleted,
            })
          );
          getLogoLocationData()
          setOpenDeleteModal(false);
          fetchLogolocationDetails()
        } else {
          dispatch(
            setAlertMessage({ type: "danger", message: serverError(response) })
          );
          dispatch(setAddLoading(false))
        }
      })
      .catch((errors) => {
        dispatch(
          setAlertMessage({
            type: "danger",
            message: ValidationMsgs.logoLocationDetails.logoLocationDetailsNotDeleted,
          })
        );
        setOpenDeleteModal(false);
        dispatch(setAddLoading(false))
      });
  };

  useEffect(() => {
    if (id) {
      setisDesabledAddCatalog(id);

      fetchLogolocationDetails()
    }
  }, []);

  return (
    <>
      <div>
        <div className="max-h-screen border-t border-neutral-200 overflow-x-auto">
          <table className="table-auto w-full text-sm text-[#191919] font-semibold">
            {/* Table header */}
            {LogoLocationsDetails.length > 0 ? (
              <thead className="text-sm font-bold uppercase text-[#b3b3b3] border-b border-neutral-200">
                <tr>
                  <th className="px-2 first:pl-5 py-4 whitespace-nowrap">
                    <div className="font-semibold text-left max-w-xs flex items-center">
                      <span>Logo Location Name</span>
                    </div>
                  </th>
                  <th className="px-2 first:pl-5 py-4 whitespace-nowrap">
                    <div className="font-semibold text-left w-40 max-w-xs flex items-center">
                      <span>Location Image</span>
                    </div>
                  </th>
                  <th className="px-2 first:pl-5 py-4 whitespace-nowrap">
                    <div className="font-semibold text-left w-40 max-w-xs flex items-center">
                      <span>3D Image</span>
                    </div>
                  </th>
                  <th className="px-2 first:pl-5 py-4 whitespace-nowrap">
                    <div className="font-semibold text-left w-52 max-w-xs flex items-center">
                      <span>3D Logo Location Class</span>
                    </div>
                  </th>
                  <th className="px-2 first:pl-5 py-4 whitespace-nowrap">
                    <div className="font-semibold text-left w-40 max-w-xs flex items-center">
                      <span>Price</span>
                    </div>
                  </th>
                  <th className="px-2 first:pl-5 py-4 whitespace-nowrap">
                    <div className="font-semibold text-left w-40 max-w-xs flex items-center">
                      <span>Cost</span>
                    </div>
                  </th>
                  <th className="px-2 first:pl-5 py-4 whitespace-nowrap">
                    <div className="font-semibold text-left w-40 max-w-xs flex items-center">
                      <span>Status</span>
                    </div>
                  </th>
                  <th className="px-2 first:pl-5 py-4 whitespace-nowrap">
                    <div className="font-semibold text-left w-40 max-w-xs flex items-center">
                      <span>Manage Logo Location</span>
                    </div>
                  </th>
                </tr>
              </thead>
            ) : !isDesabledAddCatalog ? (
              <thead>
                <tr className="flex flex-wrap uppercase font-bold text-sm mb-4 ml-8 text-rose-500 ">
                  <td className="text-rose-500 text-2xl leading-none">*</td>
                  <td>Add Vendor First To Add Catalog Data</td>
                </tr>
              </thead>
            ) : (
              LogoLocationsDetails.length < 1 && (
                <tbody className="flex flex-wrap uppercase font-bold text-sm mb-4 ml-8 text-red-500 ">
                  <tr>
                    <td>
                      <div className="flex flex-wrap uppercase font-bold text-sm mt-2 mb-1 ml-8 text-rose-500">
                        <span className="text-rose-500 text-2xl mr-2 ">
                          *
                        </span>
                        No Data yet, please add some
                      </div>
                    </td>
                  </tr>
                </tbody>
              )
            )}
            <tbody className="divide-y divide-slate-200 ">
              {LogoLocationsDetails.map((data, Index) => {
                return (
                  <tr key={Index}>
                    <td className="px-2 first:pl-5 py-3 group">
                      <div className="relative">
                        <div className="hover:text-indigo-600 cursor-pointer" onClick={() => handleShowAddlogoLocation(data)}>{data.name}</div>
                      </div>
                    </td>
                    <td className="px-2 first:pl-5 py-3">
                      <div className="flex items-center">
                        <Image
                          src={data.imageUrl ? data.imageUrl : defaultImage}
                          // className="rounded-lg align-middle border-none text-[10px] h-16 w-16"
                          className="w-20" containerheight={"h-20"}
                          alt={"logoLocationImage"}
                        />
                      </div>
                    </td>
                    <td className="px-2 first:pl-5 py-3">
                      <div className="flex items-center">
                        <Image
                          src={
                            data.threeDImageURL
                              ? data.threeDImageURL
                              : defaultImage
                          }
                          // className="rounded-lg align-middle border-none text-[10px] h-16 w-16"
                          className="w-20" containerheight={"h-20"}
                          alt={"threeDImage"}
                        />
                      </div>
                    </td>
                    <td className="px-2 first:pl-5 py-3 group">
                      <div>{data.threeDLogoLocationClass}</div>
                    </td>
                    <td className="px-2 first:pl-5 py-3 group">
                      <div>{data.price}</div>
                    </td>
                    <td className="px-2 first:pl-5 py-3 group">
                      <div>{data.cost}</div>
                    </td>

                    <td className="px-2 first:pl-5 py-3 group">
                      <div className="flex items-center"><Status type={data.recStatus} /></div>
                    </td>

                    <td className="px-2 first:pl-5 py-3 text-center">
                      <div>
                        <button
                          className="text-indigo-500 inline-block"
                          data-modal-toggle="ManageLocationModal"
                          onClick={() => {
                            setHandleLogoLocationModal(true);
                            setLogoLocationDetailsId(data.id);
                            setopenAddlogoLocationModal((prevState) => ({
                              ...prevState,
                              data: data?.id,
                            }))
                          }}
                          type="button"
                        >
                          {"Manage Logo Location"}
                        </button>
                      </div>
                    </td>
                    <td className="pl-12 pr-3">
                      <Actions
                        handleShowAddlogoLocation={handleShowAddlogoLocation}
                        setLogoLocationDetailData={setLogoLocationDetailData}
                        setOpenDeleteModal={setOpenDeleteModal}
                        recStatus={data.recStatus}
                        RecStatusValuebyName={RecStatusValuebyName.Archived}
                        data={data}
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>


          </table>
        </div>
        <ConfirmDelete
          handleDelete={handleUpdateLogoLocationDetails}
          data={LogoLocationDetailData}
          message="Deleting these LogoLocation will permanently remove this record from your account. This can't be undone"
          title={"Delete"}
          openDeleteModal={openDeleteModal}
          setOpenDeleteModal={setOpenDeleteModal}
        />
      </div>
      {handleLogoLocationModal &&
        <ManageLogoLocation setHandleLogoLocationModal={setHandleLogoLocationModal} logoLocationDetailsId={logoLocationDetailsId} logoLocationId={id} CreateAndUpdateLogoLocationBrandField={CreateAndUpdateLogoLocationBrandField}
          setOldBrands={setOldBrands}
          OldBrands={OldBrands}
        />
      }
    </>
  );
};

export default LogoLocation;
