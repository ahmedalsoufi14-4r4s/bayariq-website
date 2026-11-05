import { describe, expect, it } from 'vitest'
import { placeTooltip, spotlightBox } from './tourPosition.js'

const screen = { width: 360, height: 800 }
const tooltip = { width: 328, height: 180 }

describe('spotlightBox', () => {
  it('adds the padding on every side', () => {
    expect(spotlightBox({ x: 20, y: 30, width: 100, height: 40 }, 8)).toEqual({
      x: 12,
      y: 22,
      width: 116,
      height: 56,
    })
  })
})

describe('placeTooltip', () => {
  it('goes under the spotlight when there is room', () => {
    const spotlight = { x: 100, y: 100, width: 100, height: 50 }
    expect(placeTooltip({ spotlight, tooltip, screen }).y).toBe(162)
  })

  it('goes above the spotlight when there is no room under it', () => {
    const spotlight = { x: 100, y: 600, width: 100, height: 100 }
    expect(placeTooltip({ spotlight, tooltip, screen }).y).toBe(600 - 12 - 180)
  })

  it('sits at the bottom of the screen when it fits neither under nor above', () => {
    const spotlight = { x: 0, y: 150, width: 360, height: 550 }
    expect(placeTooltip({ spotlight, tooltip, screen }).y).toBe(800 - 16 - 180)
  })

  it('is centered on the spotlight sideways', () => {
    const wide = { width: 1280, height: 800 }
    const spotlight = { x: 500, y: 100, width: 200, height: 50 }
    expect(placeTooltip({ spotlight, tooltip, screen: wide }).x).toBe(
      600 - 328 / 2,
    )
  })

  it('never leaves the screen at either side', () => {
    const nearStart = { x: 0, y: 100, width: 40, height: 40 }
    const nearEnd = { x: 330, y: 100, width: 40, height: 40 }
    expect(placeTooltip({ spotlight: nearStart, tooltip, screen }).x).toBe(16)
    expect(placeTooltip({ spotlight: nearEnd, tooltip, screen }).x).toBe(
      360 - 16 - 328,
    )
  })

  it('keeps the margin even when the screen is shorter than the tooltip', () => {
    const tiny = { width: 360, height: 150 }
    const spotlight = { x: 0, y: 40, width: 40, height: 40 }
    expect(placeTooltip({ spotlight, tooltip, screen: tiny }).y).toBe(16)
  })
})
