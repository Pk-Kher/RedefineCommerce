import { useState } from 'react';
import { useIdleTimer } from 'react-idle-timer'
import IdleTimeModal from "components/common/modals/IdleTimeModal";
import { useEffect } from 'react';

const IdleTimerContainer = ({ logout, timeout = 15 }) => {
  const [openModal, setOpenModal] = useState(false);
  const [RemainingTime, setRemainingTime] = useState(0);

  const onPrompt = () => {
    // Fire a Modal Prompt
    setOpenModal(true);
  }
  const onIdle = () => {
    // Close Modal Prompt
    // Do some idle action like log out your user
    if (logout instanceof Function) {
      logout();
    }

  }
  const onActive = (event) => {
    // Close Modal Prompt
    // Do some active action
  }
  const onAction = (event) => {
    // Do something when a user triggers a watched event
    if (!isPrompted) {
      setOpenModal(false);
      reset();
    }
  }
  const {
    start,
    reset,
    activate,
    pause,
    resume,
    isIdle,
    isPrompted,
    isLeader,
    getTabId,
    getRemainingTime,
    getElapsedTime,
    getLastIdleTime,
    getLastActiveTime,
    getTotalIdleTime,
    getTotalActiveTime,

  } = useIdleTimer({
    onPrompt,
    onIdle,
    onActive,
    onAction,
    timeout: ((1000 * 60 * timeout) - (1000 * 60))/* 1000 * 6 * 1 */,
    promptTimeout: 1000 * 60,
    events: [
      'mousemove',
      'keydown',
      'wheel',
      'DOMMouseScroll',
      'mousewheel',
      'mousedown',
      'touchstart',
      'touchmove',
      'MSPointerDown',
      'MSPointerMove',
      'visibilitychange'
    ],
    immediateEvents: [],
    debounce: 0,
    throttle: 0,
    eventsThrottle: 0,
    element: document,
    startOnMount: true,
    startManually: false,
    stopOnIdle: false,
    crossTab: true,
    name: 'idle-timer',
    syncTimers: 0,
    leaderElection: false,
    syncTimers: 1,
  })
  const resetTime = () => {
    reset();
    setOpenModal(false);

    // activate();
    // setOpenModal(false);
    // start();
  }
  useEffect(() => {
    const temp = setInterval(() => {
      setRemainingTime(getRemainingTime());
      if (getRemainingTime() > (1000 * 60)) {
        setOpenModal(false);
      }
    }, 1000);
    return () => {
      clearInterval(temp);
    }
  }, [])
  return (
    <>
      {/* RemainingTime:{((RemainingTime) / 1000).toFixed(0)}<br /> */}
      <IdleTimeModal openModal={openModal} setOpenModal={setOpenModal} ButtonName={'Yes'} cancelButtonName={'No'}
        handleConfirmation={() => {
          setOpenModal(false);
          reset();
        }}
        cancelButtonAction={onIdle}
      >
        {"Hi, it seems kind of quiet... Are you still working?"}<br />
        Remaining Time: {((RemainingTime) / 1000).toFixed(0)}&nbsp;Seconds
      </IdleTimeModal>
    </>
  );
}
export default IdleTimerContainer;