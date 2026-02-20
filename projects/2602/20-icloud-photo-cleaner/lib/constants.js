/* iCloud Photo Cleaner - Shared Constants */

const MSG = {
  // Popup -> Background
  START_SCAN: 'PC_START_SCAN',
  STOP_SCAN: 'PC_STOP_SCAN',
  GET_STATUS: 'PC_GET_STATUS',
  CONFIRM_DELETE: 'PC_CONFIRM_DELETE',
  GET_SETTINGS: 'PC_GET_SETTINGS',
  SET_SETTINGS: 'PC_SET_SETTINGS',

  // Background -> Content
  EXTRACT_PHOTOS: 'PC_EXTRACT_PHOTOS',
  SELECT_PHOTOS: 'PC_SELECT_PHOTOS',
  DELETE_SELECTED: 'PC_DELETE_SELECTED',
  SCROLL_MORE: 'PC_SCROLL_MORE',
  PROBE_DOM: 'PC_PROBE_DOM',

  // Background -> Offscreen
  PROCESS_BATCH: 'PC_PROCESS_BATCH',
  LOAD_FACE_API: 'PC_LOAD_FACE_API',
};

const STORAGE_KEYS = {
  SCAN_STATE: 'pc_scan_state',
  SCAN_RESULTS: 'pc_scan_results',
  SETTINGS: 'pc_settings',
};

const UI_STATE = {
  IDLE: 'idle',
  NOT_ICLOUD: 'not_icloud',
  SCANNING: 'scanning',
  COMPLETE: 'complete',
  REVIEWING: 'reviewing',
  DELETING: 'deleting',
  DONE: 'done',
  ERROR: 'error',
};

const DEFAULT_SETTINGS = {
  similarityThreshold: 10,
  qualityWeights: {
    sharpness: 0.35,
    exposure: 0.20,
    contrast: 0.15,
    faceQuality: 0.30,
  },
  noFaceWeights: {
    sharpness: 0.50,
    exposure: 0.30,
    contrast: 0.20,
  },
  maxPhotosToScan: 500,
  batchSize: 20,
  enableFaceDetection: true,
};
