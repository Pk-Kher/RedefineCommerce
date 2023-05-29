import { productType } from 'dummy/Dummy';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { useDispatch, useSelector } from "react-redux";
import { serverError } from "services/common/helper/Helper"
import ProductService from 'services/admin/masterCatalog/grandMaster/products/ProductService';
import { RecStatusValuebyName } from 'global/Enum';
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";

function CheckBoxAction({ selectedFlatRows = [], type, getProductData }) {
    const permission = useSelector(store => store.permission);
    const dispatch = useDispatch();
    const [selectedIds, setSelectedIds] = useState([]);
    useEffect(() => {
        setSelectedIds(() => {
            var Ids = []
            selectedFlatRows.map((values, index) => {
                if ((values.original.recStatus == RecStatusValuebyName.Active && !values.original.isCloned)) {
                    Ids = [...Ids, values.original.id];
                }
            });
            return Ids;
        })
    }, [selectedFlatRows]);

    const cloneProduct = () => {
        // console.log(selectedFlatRows[0]);

        if (type === productType.GMC) {
            dispatch(setAddLoading(true))
            ProductService.cloneProduct(selectedIds).then((response) => {
                if (response.data.success) {
                    dispatch(
                        setAlertMessage({
                            type: "success",
                            // message: "Product clone successfully.",
                            message: "Product cloned successfully in MasterCatalog.",
                        })
                    );
                    getProductData();
                } else {
                    dispatch(setAlertMessage({ type: "danger", message: serverError(response) }));
                    dispatch(setAddLoading(false))

                }
            })
                .catch((errors) => {
                    dispatch(
                        setAlertMessage({
                            type: "danger",
                            message: "Product is not cloned.",
                        })
                    );
                    dispatch(setAddLoading(false))

                });
        }
    };
    return (
        <>
            {(permission?.isEdit || permission?.isDelete) && <div className="flex items-center -space-x-1 border border-r-0 border-indigo-300 pl-7 rounded">
                <div className="bg-white h-8 pr-4 flex items-center">{selectedIds.length} Selected</div>
                {selectedIds.length > 0 && <button className="px-3 py-2 h-8 text-xs btn-xs bg-white rounded-none border-y-0 border-indigo-300 text-indigo-500 hover:text-indigo-600" data-modal-toggle="clone" onClick={cloneProduct}>Clone Multiple</button>}
            </div>}
        </>
    )
}

export default CheckBoxAction;