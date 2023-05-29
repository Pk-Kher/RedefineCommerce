import React, { useState, useRef, useEffect } from "react";
import { Tabs as ReactTabs, Tab } from "react-tabs-scrollable";

const Tabs = ({ options, activeTab, onTabClick, isAddMode, toDisable, pClassName, cClassName, isCount = false }) => {
  const navBtnsRef = useRef();

  const [isLeftArrowDisapled, setIsLeftArrowDisabled] = useState(false);
  const [isRightArrowDisapled, setIsRightArrowDisabled] = useState(false);
  const [selectedTabCoor, setSelectedTabCoor] = useState({});
  const [showTabsFeaturesObj, setShowTabsFeaturesObj] = useState({
    tabsScrollAmount: 3,
    animationDuration: 300,
    navBtnCLickAnimationDuration: 300,
    selectedAnimationDuration: 300,
    hideNavBtns: false,
    hideNavBtnsOnMobile: true,
    NavBtnsIconColor: "rgba(0, 0, 0, 0.6)",
    showTabsScroll: false,
  });
  const [isRTL, setIsRTL] = useState(false);

  const onRTLSwitcher = () => {
    setIsRTL((prev) => !prev);
  };

  useEffect(() => {
    const body = document.querySelector("body");
    isRTL ? body.setAttribute("dir", "rtl") : body.setAttribute("dir", "ltr");
  }, [isRTL]);

  const didReachEnd = (val) => setIsRightArrowDisabled(val);
  const didReachStart = (val) => setIsLeftArrowDisabled(val);
  const selectedTabCoordinates = (coors) => setSelectedTabCoor(coors);

  return (
    <ReactTabs
      activeTab={activeTab}
      tabsClassName={pClassName && pClassName}
      tabsContainer
      onTabClick={onTabClick}
      action={navBtnsRef}
      isRTL={false}
      didReachEnd={didReachEnd}
      didReachStart={didReachStart}
      tabsScrollAmount={showTabsFeaturesObj.tabsScrollAmount}
      animationDuration={300}
      navBtnCLickAnimationDuration={
        showTabsFeaturesObj.navBtnCLickAnimationDuration
      }
      selectedAnimationDuration={showTabsFeaturesObj.selectedAnimationDuration}
      hideNavBtns={showTabsFeaturesObj.hideNavBtns}
      hideNavBtnsOnMobile={false}
      showTabsScroll={showTabsFeaturesObj.showTabsScroll}
      navBtnsIconColor={showTabsFeaturesObj.navBtnsIconColor}
      selectedTabCoordinates={selectedTabCoordinates}
    >
      {/* { !isAddMode && <Tab key="0">All</Tab> } */}
      {options.map((tab, index) => (
        <Tab
          key={index}
          {...(isAddMode && index > 0 && { disabled: true })}
          {...(toDisable &&
            toDisable.indexOf(index) !== -1 && {
            disabled: true,
          })}
          className={`${cClassName && cClassName} disabled:opacity-75 flex `}
        >
          {tab.icon && <span className={`material-icons-outlined mr-2 ${activeTab === tab.id ? 'text-red-500' : ''}`}>{tab.icon}</span>}
          <span className="">{tab.label}</span>
          {isCount && <sup className="ml-2 text-rose-800 text-xs font-medium mr-2 px-1 py-1 rounded-sm">{tab?.recordCount}</sup>}

        </Tab>
      ))}
    </ReactTabs>
  );
};

export default Tabs;
