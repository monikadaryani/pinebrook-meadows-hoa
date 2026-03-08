import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'un2jw3q6',
    dataset: 'production',
  },
  studioHost: 'pinebrook-meadows',
  /**
   * Enable auto-updates for Sanity Studio.
   * Learn more at https://www.sanity.io/docs/studio-auto-updates
   */
  autoUpdates: false,
})
