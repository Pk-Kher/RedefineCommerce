import React, { useEffect } from "react";
import Transition from "utils/Transition";

const Basic = ({
  data,
  handleConfirmation,
  openIsDefaultTemplateModal,
  setOpenIsDefaultTemplateModal,
  cancelButtonAction,
  setDefaultTemplate,
  DefaultTemplate,
  submitHandler
}) => {
  // esc hide modal
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!openIsDefaultTemplateModal || keyCode !== 27) return;
      // setOpenIsDefaultTemplateModal(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  const confirmation = () => {
    if (handleConfirmation instanceof Function) {
      handleConfirmation(data);
    } else {
      setOpenIsDefaultTemplateModal(false);
    }
  };
  const cancelFunction = () => {
    if (cancelButtonAction instanceof Function) {
      cancelButtonAction();
    }
    setOpenIsDefaultTemplateModal(false);
  };

  const resetSaveAsTemplate = () => {
    setDefaultTemplate((prevVal) => ({ roleName: "", saveAsTemplate: false, submitForm: true }))
  }

  const submitFacetCreate = () => {
    if (DefaultTemplate.saveAsTemplate) {
      if (DefaultTemplate.roleName) {
        setOpenIsDefaultTemplateModal(false);
        setDefaultTemplate((prevVal) => ({ ...prevVal, submitForm: true }));
        submitHandler()
      }
      else {
        setDefaultTemplate((prevState) => ({
          ...prevState,
          showError: true
        }))
      }
    } else {
      setOpenIsDefaultTemplateModal(false);
      setDefaultTemplate((prevVal) => ({ ...prevVal, submitForm: true }));
      submitHandler()
    }
  }

  return (
    <>
      <Transition
        className="fixed inset-0 bg-slate-900 bg-opacity-95 z-50 transition-opacity"
        show={openIsDefaultTemplateModal}
        tag="div"
        enter="transition ease-out duration-200 transform"
        enterStart="opacity-0 -translate-y-2"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-out duration-200"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
        onClick={() => setOpenIsDefaultTemplateModal(false)}
      ></Transition>
      <Transition
        className="fixed inset-0 z-50 overflow-hidden flex items-center my-4 justify-center transform px-4 sm:px-6"
        show={openIsDefaultTemplateModal}
        tag="div"
        id="basic-modal"
        enter="transition ease-out duration-200 transform"
        enterStart="opacity-0 -translate-y-2"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-out duration-200"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
      >
        <div className="bg-white rounded shadow-lg overflow-auto max-w-lg w-full max-h-full" >
          {/* Modal header */}
          <div className="px-5 py-3">
            <div className="flex justify-between items-center">
              <div className="font-semibold text-gray-800">
              </div>
              <button className="text-gray-400 hover:text-gray-500" onClick={() => { setOpenIsDefaultTemplateModal(false); resetSaveAsTemplate() }}>
                <div className="sr-only" >Close</div>
                <svg className="w-4 h-4 fill-current">
                  <path d="M7.95 6.536l4.242-4.243a1 1 0 111.415 1.414L9.364 7.95l4.243 4.242a1 1 0 11-1.415 1.415L7.95 9.364l-4.243 4.243a1 1 0 01-1.414-1.415L6.536 7.95 2.293 3.707a1 1 0 011.414-1.414L7.95 6.536z">
                  </path>
                </svg>
              </button>
            </div>
          </div>
          {/* Modal content */}
          <div className="px-5 pt-4 pb-5">
            <div className="w-full mb-6 last:mb-0" x-data="{ checked: false }">
              <div className="flex justify-between">
                <div className="inline-flex items-center text-sm leading-none">
                  <span>do you want to save as template?</span>
                </div>
                <div className="flex items-center">
                  <div className="w-16 relative">
                    <input type="checkbox" id="switch-3" className="sr-only" onChange={(e) => setDefaultTemplate((prevVal) => ({ ...prevVal, saveAsTemplate: e.target.checked }))} />
                    <label className={`text-gray-500 lef text-center h-7 cursor-pointer flex items-center justify-center rounded leading-5 ${DefaultTemplate.saveAsTemplate ? 'bg-green-600' : 'bg-slate-600'}`} htmlFor={"switch-3"}>
                      <span className={`bg-white shadow-sm w-6 h-6 transition-all absolute rounded ${DefaultTemplate.saveAsTemplate ? 'left-[38px]' : 'left-0.5'}`} aria-hidden="true" ></span>
                      <span className={`text-white text-xs inline-block absolute right-2 ${DefaultTemplate.saveAsTemplate ? 'opacity-0' : 'opacity-100'}`} >{DefaultTemplate.saveAsTemplate ? 'ON' : 'OFF'}</span>
                      <span className={`text-white text-xs inline-block absolute left-2 ${DefaultTemplate.saveAsTemplate ? 'opacity-1' : 'opacity-0'}`} >{DefaultTemplate.saveAsTemplate ? 'ON' : 'OFF'}</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="w-full mt-3">
                {
                  DefaultTemplate.saveAsTemplate && <>
                    <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2" htmlFor="grid-first-name">Role Name <span className="text-rose-500 text-2xl leading-none">*</span></label>
                    <input className="block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md" type="text" placeholder defaultValue={DefaultTemplate.roleName} onChange={(e) => setDefaultTemplate((prevVal) => ({ ...prevVal, roleName: e.target.value }))} />

                    {(DefaultTemplate.saveAsTemplate && DefaultTemplate.showError && !DefaultTemplate.roleName) && <div className={"text-red-500"}>{"Role name is required"}</div>}

                  </>
                }
              </div>

              {/* Modal footer */}
              <div className="px-5 py-4" >
                <div className="flex flex-wrap justify-end space-x-2">
                  <button className="btn border-gray-300 hover:border-neutral-400 text-gray-500" onClick={() => { setOpenIsDefaultTemplateModal(false); resetSaveAsTemplate() }}>Close</button>
                  <button className="btn bg-indigo-500 hover:bg-indigo-600 text-white" onClick={() => submitFacetCreate()}>Save</button>
                </div >
              </div>
            </div>
          </div >
        </div >

      </Transition >
    </>
  );
};

export default Basic;
