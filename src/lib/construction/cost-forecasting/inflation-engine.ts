export type ForecastInflationProfile = {
  economic: number
  normal: number
  premium: number
}

export function getForecastInflationProfile(): ForecastInflationProfile {
  return {
    economic: 1.02,
    normal: 1.05,
    premium: 1.1,
  }
}
