const LogFormatter = require('./log-formatter');

const log = require('loglevel').getLogger('Request');

/**
 * @param {number} data
 * @returns {ScanDeviceFeature} feature
 */
function constrainWithFeature(value, feature) {
  return Math.max(Math.min(value || feature.default, feature.limits[1]), feature.limits[0]);
}

/**
 *
 * @param {string[]} list
 * @param {string|string[]} value
 * @param {string} message
 */
function assertContains(list, value, message) {
  if (Array.isArray(value)) {
    value.forEach(v => assertContains(list, v, message));
  } else if (!list.includes(value)) {
    throw new Error(`${message}: '${value}' not in '${list}'`);
  }
}

module.exports = class Request {
  /**
   * Constructor
   * @param {Context} context
   * @param {ScanRequest} data
   */
  constructor(context, data) {
    Object.assign(this, {
      params: {}
    });

    const device = context.getDevice(data.params.deviceId);
    const features = device.features;

    Object.assign(this, {
      params: {
        deviceId: device.id,
        resolution: data.params.resolution || features['--resolution'].default,
        isPreview: data.params.isPreview || false
      }
    });

    if ('-t' in features) {
      this.params.top = constrainWithFeature(data.params.top || features['-t'].limits[0], features['-t']);
    }
    if ('-l' in features) {
      this.params.left = constrainWithFeature(data.params.left || features['-l'].limits[0], features['-l']);
    }
    if ('-x' in features) {
      this.params.width = constrainWithFeature(data.params.width || features['-x'].limits[1], features['-x']);
    }
    if ('-y' in features) {
      this.params.height = constrainWithFeature(data.params.height || features['-y'].limits[1], features['-y']);
    }
    if ('--page-height' in features) {
      this.params.pageHeight = constrainWithFeature(data.params.pageHeight, features['--page-height']);
    }
    if ('--page-width' in features) {
      this.params.pageWidth = constrainWithFeature(data.params.pageWidth, features['--page-width']);
    }

    if ('--mode' in features) {
      this.params.mode = data.params.mode || features['--mode'].default;
      assertContains(features['--mode'].options, this.params.mode, 'Invalid --mode');
    }
    if ('--format' in features) {
      this.params.format = data.params.format || features['--format'].default;
      assertContains(features['--format'].options, this.params.format, 'Invalid --format');
    }
    if ('--adf-mode' in features) {
      this.params.adfMode = data.params.adfMode || features['--adf-mode'].default;
      assertContains(features['--adf-mode'].options, this.params.adfMode, 'Invalid --adf-mode');
    }
    if ('--gamma-correction' in features) {
      this.params.gammaCorrection = data.params.gammaCorrection || features['--gamma-correction'].default;
      assertContains(features['--gamma-correction'].options, this.params.gammaCorrection, 'Invalid --gamma-correction');
    }
    if ('--color-correction' in features) {
      this.params.colorCorrection = data.params.colorCorrection || features['--color-correction'].default;
      assertContains(features['--color-correction'].options, this.params.colorCorrection, 'Invalid --color-correction');
    }
    if ('--color-space' in features) {
      this.params.colorSpace = data.params.colorSpace || features['--color-space'].default;
      assertContains(features['--color-space'].options, this.params.colorSpace, 'Invalid --color-space');
    }
    if ('--depth' in features) {
      this.params.depth = data.params.depth || features['--depth'].default;
      assertContains(features['--depth'].options, this.params.depth, 'Invalid --depth');
    }
    if ('--source' in features) {
      this.params.source = data.params.source || features['--source'].default;
      assertContains(features['--source'].options, this.params.source, 'Invalid --source');
    }
    if ('--brightness' in features) {
      this.params.brightness = data.params.brightness || 0;
    }
    if ('--contrast' in features && this.params.mode !== 'Lineart') {
      this.params.contrast = data.params.contrast || 0;
    }
    if ('--disable-dynamic-lineart' in features) {
      this.params.dynamicLineart = data.params.dynamicLineart !== undefined
        ? data.params.dynamicLineart
        : true;
    }
    if ('--ald' in features) {
      this.params.ald = data.params.ald || features['--ald'].default;
      assertContains(features['--ald'].options, this.params.ald, 'Invalid --ald');
    }

    log.trace(LogFormatter.format().full(this));
  }
};
