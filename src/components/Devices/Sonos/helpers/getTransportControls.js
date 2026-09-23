export const getTransportControls = (device) => {
  if (!device) {
    return {
      pending: true,
      showShuffle: false,
      showPrev: true,
      showNext: true,
      isPlaying: false,
    };
  }

  const caps = device.capabilities || Object.keys(device.capabilitiesObj || {});
  return {
    pending: false,
    showShuffle: caps.includes("speaker_shuffle"),
    showPrev: caps.includes("speaker_prev"),
    showNext: caps.includes("speaker_next"),
    isPlaying: Boolean(device.capabilitiesObj?.speaker_playing?.value),
  };
};
