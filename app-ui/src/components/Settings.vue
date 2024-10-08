<template>
  <div>
    <settings-section>
      <template #items>
        <settings-item>
          <template #description>
            {{ $t('settings.theme') }}
            <br>
            {{ $t('settings.theme:description') }}
          </template>
          <template #action>
            <div style="max-width: 10rem;">
              <v-select v-model="settings.theme" :items="themes" item-title="text" @update:model-value="reload" />
            </div>
          </template>
        </settings-item>
        <settings-item>
          <template #description>
            {{ $t('settings.show-files-after-scan:description') }}
          </template>
          <template #action>
            <div style="max-width: 10rem;">
              <v-switch v-model="settings.showFilesAfterScan" />
            </div>
          </template>
        </settings-item>
      </template>
    </settings-section>

    <div class="text-body-1 mb-4">
      {{ $t('about.api') }}
      <a target="_blank" href="api-docs">/api-docs</a>
    </div>
  </div>
</template>

<script>
import { mdiDelete, mdiRefresh } from '@mdi/js';
import Common from '../classes/common';
import Constants from '../classes/constants';
import Storage from '../classes/storage';

import SettingsSection from './SettingsSection.vue';
import SettingsItem from './SettingsItem.vue';

const storage = Storage.instance();

export default {
  name: 'Settings',

  components: {
    SettingsSection,
    SettingsItem
  },

  emits: ['mask', 'notify'],

  setup() {
    return {
      mdiDelete,
      mdiRefresh,
    };
  },

  data() {
    return {
      settings: storage.settings
    };
  },

  computed: {
    colors() {
      return Constants.Colors.map(c => {
        return {
          text: this.$t(`colors.${c}`),
          value: c
        };
      });
    },

    locales() {
      return Constants.Locales.map(l => {
        return {
          text: this.$t(`locales.${l}`),
          value: l
        };
      });
    },

    themes() {
      return Object.keys(Constants.Themes).map(t => {
        return {
          text: this.$t(`settings.theme:${Constants.Themes[t]}`),
          value: Constants.Themes[t]
        };
      });
    }
  },

  watch: {
    settings: {
      handler(settings) {
        storage.settings = settings;
      },
      deep: true
    }
  },

  methods: {
    clearStorage() {
      storage.request = null;
    },

    reload() {
      location.href = `?anticache=${Date.now()}${location.hash}`;
    }
  }
};
</script>

<style>

</style>
