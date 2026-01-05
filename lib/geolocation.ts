/**
 * Utility functions for handling geolocation with better error messages
 */

/**
 * Get a detailed error message for geolocation errors
 */
export const getGeolocationErrorMessage = (error: GeolocationPositionError): string => {
  let errorMessage = "Gagal mendapatkan lokasi. ";
  
  switch(error.code) {
    case 1: // PERMISSION_DENIED
      errorMessage += "Izin akses lokasi ditolak. Mohon aktifkan izin lokasi untuk situs ini di pengaturan browser Anda.";
      break;
    case 2: // POSITION_UNAVAILABLE
      errorMessage += "Informasi lokasi tidak tersedia. ";
      errorMessage += "Pastikan GPS perangkat Anda aktif, Anda mengakses situs ini melalui HTTPS atau localhost, ";
      errorMessage += "dan tidak menggunakan pemblokir lokasi seperti VPN atau jaringan perusahaan.";
      break;
    case 3: // TIMEOUT
      errorMessage += "Permintaan untuk mendapatkan lokasi melewati batas waktu. Coba lagi nanti.";
      break;
    default:
      errorMessage += "Terjadi kesalahan yang tidak diketahui.";
      break;
  }
  
  return errorMessage;
};

/**
 * Check if we're in a secure context (required for geolocation)
 */
export const isSecureContext = (): boolean => {
  return window.isSecureContext || location.protocol === 'https:' || location.hostname === 'localhost';
};

/**
 * Request geolocation with enhanced options and error handling
 */
export const requestGeolocation = (
  successCallback: PositionCallback,
  errorCallback: PositionErrorCallback,
  options: PositionOptions = {}
): void => {
  if (!navigator.geolocation) {
    // Create a custom error object since GeolocationPositionError is read-only
    const error = {
      code: 2, // POSITION_UNAVAILABLE
      message: "Geolocation tidak didukung oleh browser ini"
    } as GeolocationPositionError;
    errorCallback(error);
    return;
  }

  // Default options with better compatibility
  const defaultOptions: PositionOptions = {
    enableHighAccuracy: false, // More compatible with various devices
    timeout: 15000,
    maximumAge: 60000
  };

  const finalOptions: PositionOptions = { ...defaultOptions, ...options };

  navigator.geolocation.getCurrentPosition(successCallback, errorCallback, finalOptions);
};