import {tsImport} from 'tsx/esm/api'
import {defineConfig, type UserConfigExport} from 'vite'

const {config} = (await tsImport('config/vitest.node', import.meta.url)) as {
  config: UserConfigExport
}

export default defineConfig(config)
