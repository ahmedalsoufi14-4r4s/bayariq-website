import { test as base } from '@playwright/test'

export { expect } from '@playwright/test'

// Playwright's test, with the outside world answered locally: the maps on the branch cards get an
// empty page instead of Google, so the tests never depend on it or send it anything.
// (Playwright's guides call the second parameter "use"; ESLint would take it for a React hook.)
export const test = base.extend({
  context: async ({ context }, provide) => {
    await context.route('https://www.google.com/maps**', (route) =>
      route.fulfill({ contentType: 'text/html', body: '<p>Map</p>' }),
    )
    await provide(context)
  },
})
