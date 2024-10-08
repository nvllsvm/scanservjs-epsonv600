const log = require('loglevel').getLogger('ScanimageCommand');

const CommandBuilder = require('./command-builder');
const Constants = require('../constants');
const LogFormatter = require('./log-formatter');
const Process = require('./process');
const semver = require('semver');

class Scanimage {

  /**
   * @param {Configuration} config
   */
  constructor(config) {
    this.config = config;
  }
}

module.exports = class ScanimageCommand {
  constructor(config) {
    this.config = config;
    this.scanimage = new Scanimage(config);
  }

  /**
   * @returns {string}
   */
  devices() {
    return new CommandBuilder(this.config.scanimage)
      .arg('-L')
      .build();
  }

  /**
   * @param {string} deviceId
   * @returns {string}
   */
  features(deviceId) {
    return new CommandBuilder(this.config.scanimage)
      .arg('-d', deviceId)
      .arg('-A')
      .build();
  }

  /**
   * @param {ScanRequest} request
   * @returns {string}
   */
  scan(request) {
    log.debug(LogFormatter.format().full(request));
    const params = request.params;
    const cmdBuilder = new CommandBuilder(this.config.scanimage);
    cmdBuilder.arg('-d', params.deviceId);

    if ('source' in params) {
      cmdBuilder.arg('--source', params.source);
    }
    if ('mode' in params) {
      cmdBuilder.arg('--mode', params.mode);
    }
    if ('gammaCorrection' in params) {
      cmdBuilder.arg('--gamma-correction', params.gammaCorrection);
    }
    if ('colorCorrection' in params) {
      cmdBuilder.arg('--color-correction', params.colorCorrection);
    }
    if ('colorSpace' in params) {
      cmdBuilder.arg('--color-space', params.colorSpace);
    }
    if ('adfMode' in params) {
      cmdBuilder.arg('--adf-mode', params.adfMode);
    }

    cmdBuilder.arg('--resolution', params.resolution);

    if ('pageWidth' in params) {
      cmdBuilder.arg('--page-width', params.pageWidth);
    }
    if ('pageHeight' in params) {
      cmdBuilder.arg('--page-height', params.pageHeight);
    }
    if ('left' in params) {
      cmdBuilder.arg('-l', params.left);
    }
    if ('top' in params) {
      cmdBuilder.arg('-t', params.top);
    }
    if ('width' in params) {
      cmdBuilder.arg('-x', params.width);
    }
    if ('height' in params) {
      cmdBuilder.arg('-y', params.height);
    }

    cmdBuilder.arg('--format', params.format);

    if ('ald' in params) {
      cmdBuilder.arg(`--ald=${params.ald}`);
    }
    if ('depth' in params) {
      cmdBuilder.arg('--depth', params.depth);
    }
    if ('brightness' in params) {
      cmdBuilder.arg('--brightness', params.brightness);
    }
    if ('contrast' in params) {
      cmdBuilder.arg('--contrast', params.contrast);
    }
    if (params.mode === 'Lineart' && params.dynamicLineart === false) {
      cmdBuilder.arg('--disable-dynamic-lineart=yes');
    }
    if ('isPreview' in params && params.isPreview) {
      cmdBuilder.arg('--preview')
    } else {
      cmdBuilder.arg('-o', 'TODO_fixme.tif');
    }
    return cmdBuilder.build();
  }
};
