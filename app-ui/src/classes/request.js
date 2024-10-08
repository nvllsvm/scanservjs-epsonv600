import Constants from './constants';

export default class Request {

  /**
   * @param {Request} request 
   * @param {Device} device
   */
  constructor(request, device) {
    request = request || {};
    request.params = request.params || {};

    Object.assign(this, {
      version: Constants.Version,
      params: {
        deviceId: device.id,
        format: request.params.format || device.features['--format'].default,
        resolution: request.params.resolution || device.features['--resolution'].default
      }
    });

    if ('-x' in device.features) {
      this.params.width = request.params.width || device.features['-x'].default;
    }
    if ('-y' in device.features) {
      this.params.height = request.params.height || device.features['-y'].default;
    }
    if ('-l' in device.features) {
      this.params.left = request.params.left || device.features['-l'].default;
    }
    if ('-t' in device.features) {
      this.params.top = request.params.top || device.features['-t'].default;
    }
    if ('--page-height' in device.features) {
      this.params.pageHeight = request.params.pageHeight || device.features['--page-height'].default;
    }
    if ('--page-width' in device.features) {
      this.params.pageWidth = request.params.pageWidth || device.features['--page-width'].default;
    }
    
    if ('--adf-mode' in device.features) {
      this.params.adfMode = request.params.adfMode || device.features['--adf-mode'].default;
    }
    if ('--depth' in device.features) {
      this.params.depth = request.params.depth || device.features['--depth'].default;
    }
    if ('--gamma-correction' in device.features) {
      this.params.gammaCorrection = request.params.gammaCorrection || device.features['--gamma-correction'].default;
    }
    if ('--color-correction' in device.features) {
      this.params.colorCorrection = request.params.colorCorrection || device.features['--color-correction'].default;
    }
    if ('--color-space' in device.features) {
      this.params.colorSpace = request.params.colorSpace || device.features['--color-space'].default;
    }
    if ('--mode' in device.features) {
      this.params.mode = request.params.mode || device.features['--mode'].default;
    }
    if ('--source' in device.features) {
      this.params.source = request.params.source || device.features['--source'].default;
    }
    if ('--brightness' in device.features) {
      this.params.brightness = request.params.brightness || device.features['--brightness'].default;
    }
    if ('--contrast' in device.features) {
      this.params.contrast = request.params.contrast || device.features['--contrast'].default;
    }
    if ('--disable-dynamic-lineart' in device.features) {
      this.params.dynamicLineart = request.params.dynamicLineart !== undefined
        ? request.params.dynamicLineart
        : true;
    }
  }

  /**
   * @param {Request} request 
   * @param {Device} device
   * @returns 
   */
  static create(request, device) {
    return new Request(request, device);
  }
}
