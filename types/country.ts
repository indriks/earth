export interface CountryDetail {
  cca3: string
  name: {
    common: string
    official: string
  }
  capital: string[]
  region: string
  subregion: string
  population: number
  area: number
  flags: {
    png: string
  }
  languages: { [key: string]: string }
  currencies: { [key: string]: { name: string; symbol: string } }
}

export interface Country {
  name: {
    common: string
    nativeName: { [key: string]: { common: string } }
  }
  translations: { [key: string]: { common: string } }
  cca3: string
  cca2: string
  region: string
}
