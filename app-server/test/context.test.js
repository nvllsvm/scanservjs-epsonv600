/* eslint-env mocha */
const assert = require('assert');
const Context = require('../src/classes/context');
const UserOptions = require('../src/classes/user-options');

const application = require('../src/application');
application._userOptions = new UserOptions();

const config = application.config();

describe('Context', () => {
  it('settings:default', () => {
    const device = {
      id: 'test-scanner',
      features: {
        '--resolution': {
          default: 50,
          options: [50, 75]
        },
      }
    };

    const context = new Context(config, [device], new UserOptions());
    assert.strictEqual(context.devices.length, 1);
    assert.deepStrictEqual(context.devices[0].settings, {
      pipeline: {
        options: [
          'JPG | @:pipeline.high-quality',
          'JPG | @:pipeline.medium-quality',
          'JPG | @:pipeline.low-quality',
          'PNG',
          'TIF | @:pipeline.uncompressed',
          'TIF | @:pipeline.lzw-compressed',
          'PDF (TIF | @:pipeline.uncompressed)',
          'PDF (TIF | @:pipeline.lzw-compressed)',
          'PDF (JPG | @:pipeline.high-quality)',
          'PDF (JPG | @:pipeline.medium-quality)',
          'PDF (JPG | @:pipeline.low-quality)',
          '@:pipeline.ocr | PDF (JPG | @:pipeline.high-quality)',
          '@:pipeline.ocr | @:pipeline.text-file'
        ],
        default: 'JPG | @:pipeline.high-quality'
      }
    });
  });

  it('settings:override', () => {
    const device = {
      id: 'test-scanner',
      features: {
        '--resolution': {
          default: 50,
          options: [50, 75]
        },
      }
    };

    const userOptions = new UserOptions();
    userOptions.afterDevices = (devices) => {
      devices.forEach(device => {
        device.settings.pipeline = {
          options: [
            'JPG | @:pipeline.low-quality'
          ],
          default: 'JPG | @:pipeline.low-quality'
        };
      });
    };

    const context = new Context(config, [device], userOptions);
    assert.strictEqual(context.devices.length, 1);
    assert.deepStrictEqual(context.devices[0].settings, {
      pipeline: {
        options: [
          'JPG | @:pipeline.low-quality'
        ],
        default: 'JPG | @:pipeline.low-quality'
      }
    });
  });

  it('settings:override-and-new', () => {
    const device = {
      id: 'test-scanner',
      features: {
        '--resolution': {
          default: 50,
          options: [50, 75]
        },
      }
    };

    const userOptions = new UserOptions();
    userOptions.afterDevices = (devices) => {
      devices.forEach(device => {
        device.settings.pipeline = {
          options: [
            'JPG | @:pipeline.low-quality'
          ],
          default: 'JPG | @:pipeline.low-quality'
        };
      });

      devices.push({
        id: 'test-scanner-new',
        features: {
          '--resolution': {
            default: 50,
            options: [50, 75]
          },
        },
        settings: {
        }
      });
    };

    const context = new Context(config, [device], userOptions);
    assert.strictEqual(context.devices.length, 2);
    assert.deepStrictEqual(context.devices[0].settings, {
      pipeline: {
        options: [
          'JPG | @:pipeline.low-quality'
        ],
        default: 'JPG | @:pipeline.low-quality'
      }
    });

    assert.deepStrictEqual(context.devices[1].settings, {
      pipeline: {
        options: [
          'JPG | @:pipeline.high-quality',
          'JPG | @:pipeline.medium-quality',
          'JPG | @:pipeline.low-quality',
          'PNG',
          'TIF | @:pipeline.uncompressed',
          'TIF | @:pipeline.lzw-compressed',
          'PDF (TIF | @:pipeline.uncompressed)',
          'PDF (TIF | @:pipeline.lzw-compressed)',
          'PDF (JPG | @:pipeline.high-quality)',
          'PDF (JPG | @:pipeline.medium-quality)',
          'PDF (JPG | @:pipeline.low-quality)',
          '@:pipeline.ocr | PDF (JPG | @:pipeline.high-quality)',
          '@:pipeline.ocr | @:pipeline.text-file'
        ],
        default: 'JPG | @:pipeline.high-quality'
      }
    });
  });
});
