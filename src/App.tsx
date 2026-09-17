import { BuyerMatchDemo } from './components/sections/BuyerMatchDemo'
import { SupplierWindow } from './components/sections/SupplierWindow'
import {
  BusinessModel,
  Closing,
  CompatibilityExplainer,
  Footer,
  Hero,
  Problem,
  Roadmap,
  ScopeStatus,
  UserSystemFlow,
} from './components/sections/Explainers'
import { DemoProvider } from './state/DemoProvider'

/**
 * One page, ten sections, in the order a first time visitor needs them:
 * what it is, why it exists, what happens, both sides of it, what is settled,
 * and why it matters.
 */
export default function App() {
  return (
    <DemoProvider>
      <a className="skip-link" href="#demo">
        Skip to the interactive demo
      </a>
      <main>
        <Hero />
        <Problem />
        <BuyerMatchDemo />
        <SupplierWindow />
        <UserSystemFlow />
        <CompatibilityExplainer />
        <Roadmap />
        <BusinessModel />
        <ScopeStatus />
        <Closing />
      </main>
      <Footer />
    </DemoProvider>
  )
}
