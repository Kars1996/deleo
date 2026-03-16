import type { ElectrobunConfig } from "electrobun";

export default {
  app: {
    name: "deleo",
    identifier: "bio.kars.deleo",
    version: "0.0.1",
  },
  build: {
    copy: {
      "dist/index.html": "views/mainview/index.html",
      "dist/assets":     "views/mainview/assets",
    },
    mac: {
      bundleCEF: false,
    },
    linux: {
      bundleCEF: false,
    },
    win: {
      bundleCEF: false,
    },
  },
} satisfies ElectrobunConfig;
