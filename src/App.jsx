import store from './data/store.json'

// Base page layout. The header and footer are added in Step 2.
function App() {
  return (
    <div className="flex min-h-dvh flex-col bg-white text-gray-900">
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <h1 className="text-start text-3xl font-bold">{store.name_ar}</h1>
      </main>
    </div>
  )
}

export default App
