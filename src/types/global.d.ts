interface LocaleParams {
    params: { locale: string }
}

type Locale = 'en' | 'fr'

type tParams = Promise<{ locale: string }>
