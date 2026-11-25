import { useEffect, useState } from 'react'
import { AlertIcon } from '../components/Icons.jsx'
import LogoMark from '../components/LogoMark.jsx'
import PageBackdrop from '../components/PageBackdrop.jsx'
import Photo from '../components/Photo.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import { BUTTON_ACCENT, BUTTON_ON_MAIN, CARD } from '../components/styles.js'
import ThemeToggle from '../components/ThemeToggle.jsx'
import WaveDivider from '../components/WaveDivider.jsx'
import store from '../data/store.json'
import { useLanguage } from '../i18n/LanguageContext.js'

const OPEN_FOOD_FACTS = 'Open Food Facts'
const LINKS = {
  site: 'https://world.openfoodfacts.org',
  license: 'https://creativecommons.org/licenses/by-sa/3.0/',
  dataLicense: 'https://opendatacommons.org/licenses/odbl/1-0/',
}

const TEXT_LINK =
  'inline-flex min-h-11 items-center gap-1 text-main-ink underline underline-offset-4 transition duration-150 ease-out hover:decoration-2'

// A link to another website. It opens in a new tab, so the visitor keeps the shop.
function OutsideLink({ href, children }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className={TEXT_LINK}>
      {children}
    </a>
  )
}

// One photo: the product, where its photo comes from (a link) and the license.
function CreditCard({ photo }) {
  const { t } = useLanguage()
  const license =
    photo.license === 'All rights reserved'
      ? t.credits.allRightsReserved
      : photo.license

  return (
    <li className={`${CARD} flex items-center gap-3 p-3`}>
      <Photo
        src={`images/products/${photo.productId}.webp`}
        alt={photo.productName}
        width={400}
        height={400}
        className="size-16 shrink-0 rounded-xl bg-photo-paper object-contain"
        fallback={null}
      />
      <div className="min-w-0 text-sm">
        <p className="font-bold">
          <bdi lang="ar">{photo.productName}</bdi>
        </p>
        <OutsideLink href={photo.sourceUrl}>
          {t.credits.source}: <bdi lang="en">{photo.sourceName}</bdi>
        </OutsideLink>
        <p className="text-muted">
          <bdi>{license}</bdi>
        </p>
      </div>
    </li>
  )
}

// A group of photos with its title, an explanation (children) and its cards.
function CreditGroup({ id, title, photos, children }) {
  const { t } = useLanguage()
  if (photos.length === 0) return null

  return (
    <section aria-labelledby={id} className="mt-12">
      <SectionHeading id={id}>{title}</SectionHeading>
      <div className="mt-4 max-w-3xl space-y-2">{children}</div>
      <p className="mt-4 font-bold">
        {t.credits.count} {photos.length}
      </p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((photo) => (
          <CreditCard key={photo.productId} photo={photo} />
        ))}
      </ul>
    </section>
  )
}

// The whole photo credits page. The list is public/data/photo-credits.json, the same file that
// tells `npm run products` which products have a photo, so every photo on the site is in it.
function PhotoCredits() {
  const { t, language, toggleLanguage, localize } = useLanguage()
  const [photos, setPhotos] = useState([])
  const [status, setStatus] = useState('loading') // 'loading', 'ready' or 'failed'

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/photo-credits.json`)
      .then((response) => {
        if (!response.ok) throw new Error(`photo-credits: ${response.status}`)
        return response.json()
      })
      .then((list) => {
        setPhotos(list)
        setStatus('ready')
      })
      .catch(() => setStatus('failed'))
  }, [])

  const openPhotos = photos.filter(
    (photo) => photo.sourceName === OPEN_FOOD_FACTS,
  )
  const makerPhotos = photos.filter(
    (photo) => photo.sourceName !== OPEN_FOOD_FACTS,
  )
  const { openFoodFacts, makers } = t.credits

  return (
    <div className="flex min-h-dvh flex-col">
      <PageBackdrop />
      <header className="surface-main">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <a
            href={import.meta.env.BASE_URL}
            className="group flex min-h-11 min-w-0 items-center gap-2 text-[15px] font-bold md:text-lg"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-logo-paper p-0.5 shadow-sm shadow-black/20 transition duration-300 ease-out motion-safe:group-hover:scale-110 motion-safe:group-hover:-rotate-6">
              <LogoMark className="size-full" />
            </span>
            {localize(store, 'name')}
          </a>
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              lang={language === 'ar' ? 'en' : 'ar'}
              onClick={toggleLanguage}
              className={`${BUTTON_ON_MAIN} me-1 min-h-11 px-3 text-sm`}
            >
              {t.switchLanguage}
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <WaveDivider flip />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-16">
        <h1 className="text-3xl font-bold md:text-4xl">{t.credits.title}</h1>
        <p className="mt-4 max-w-3xl">{t.credits.intro}</p>
        <p className="mt-2 max-w-3xl text-muted">{t.credits.trademarks}</p>
        <a
          href={import.meta.env.BASE_URL}
          className={`${BUTTON_ACCENT} mt-6 px-5 py-3`}
        >
          {t.credits.back}
        </a>

        {status === 'loading' && (
          <p role="status" className="mt-12 text-muted">
            {t.credits.loading}
          </p>
        )}
        {status === 'failed' && (
          <p
            role="alert"
            className={`${CARD} mt-12 flex items-center gap-3 p-4`}
          >
            <AlertIcon className="size-6 shrink-0 text-main-ink motion-safe:card-active:animate-wiggle" />
            {t.credits.loadFailed}
          </p>
        )}

        <CreditGroup
          id="open-food-facts"
          title={openFoodFacts.title}
          photos={openPhotos}
        >
          <p>{openFoodFacts.text}</p>
          <p>{openFoodFacts.changes}</p>
          <p>{openFoodFacts.data}</p>
          <p className="flex flex-wrap gap-x-6">
            <OutsideLink href={LINKS.site}>{openFoodFacts.site}</OutsideLink>
            <OutsideLink href={LINKS.license}>
              {openFoodFacts.license}
            </OutsideLink>
            <OutsideLink href={LINKS.dataLicense}>
              {openFoodFacts.dataLicense}
            </OutsideLink>
          </p>
        </CreditGroup>

        <CreditGroup id="makers" title={makers.title} photos={makerPhotos}>
          <p>{makers.text}</p>
        </CreditGroup>
      </main>
    </div>
  )
}

export default PhotoCredits
