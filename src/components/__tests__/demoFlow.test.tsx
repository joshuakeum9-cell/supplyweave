import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '@/App'

/**
 * These drive the real interface through the real reducer. Nothing is stubbed,
 * so a passing run means a visitor can reach the documented result by clicking.
 */

async function setup() {
  const user = userEvent.setup()
  render(<App />)
  // Take the immediate path so the tests do not wait on the staged reveal.
  await user.click(screen.getByLabelText(/show results immediately/i))
  return user
}

describe('buyer match demo', () => {
  it('reaches the documented result: $0.3740, $7,480.00 and $1,120.00 saved', async () => {
    const user = await setup()

    await user.click(screen.getByRole('button', { name: /save requirement/i }))
    expect(await screen.findByText(/private production opportunity/i)).toBeInTheDocument()

    await user.click(screen.getAllByRole('button', { name: /commit demo order/i })[0])

    await screen.findByRole('heading', { name: /order executed/i })

    expect(screen.getAllByText('$0.3740').length).toBeGreaterThan(0)
    expect(screen.getAllByText('$7,480.00').length).toBeGreaterThan(0)
    expect(screen.getAllByText('$1,120.00').length).toBeGreaterThan(0)
    expect(screen.getAllByText('13.0 percent').length).toBeGreaterThan(0)
  })

  it('moves matched volume from 35,000 to 55,000 units', async () => {
    const user = await setup()
    expect(screen.getAllByText(/35,000 units/).length).toBeGreaterThan(0)

    await user.click(screen.getByRole('button', { name: /save requirement/i }))
    await user.click(screen.getAllByRole('button', { name: /commit demo order/i })[0])

    await screen.findByRole('heading', { name: /order executed/i })
    expect(screen.getAllByText(/55,000 units/).length).toBeGreaterThan(0)
    expect(screen.getByText(/Remaining 5,000/)).toBeInTheDocument()
  })

  it('labels the result as illustrative and shows the delivery window', async () => {
    const user = await setup()
    await user.click(screen.getByRole('button', { name: /save requirement/i }))
    await user.click(screen.getAllByRole('button', { name: /commit demo order/i })[0])
    await screen.findByRole('heading', { name: /order executed/i })

    expect(screen.getAllByText(/illustrative demo data/i).length).toBeGreaterThan(0)
    expect(screen.getByText(/October 26 to 28, 2026/)).toBeInTheDocument()
    expect(screen.getByText(/Scheduled for production/)).toBeInTheDocument()
  })

  it('shows the price breakdown with the disclosed fee', async () => {
    const user = await setup()
    await user.click(screen.getByRole('button', { name: /save requirement/i }))

    await user.click(screen.getByRole('button', { name: /how this delivered price is built/i }))
    expect(screen.getByText('$0.3375')).toBeInTheDocument()
    expect(screen.getByText('$0.0290')).toBeInTheDocument()
    expect(screen.getByText('$0.0075')).toBeInTheDocument()
    expect(screen.getByText(/never becomes the price/i)).toBeInTheDocument()
  })

  it('blocks the order when the delivered price is above the buyer maximum', async () => {
    const user = await setup()
    await user.click(screen.getByLabelText(/price above the buyer maximum/i))
    await user.click(screen.getByRole('button', { name: /save requirement/i }))
    await user.click(screen.getAllByRole('button', { name: /commit demo order/i })[0])

    expect((await screen.findAllByText(/nothing was ordered/i)).length).toBeGreaterThan(0)
    expect(screen.getByText(/Not executed/)).toBeInTheDocument()
    // Matched volume never moved, so no executed figures exist anywhere.
    expect(screen.queryByText('$7,480.00')).not.toBeInTheDocument()
    expect(screen.queryByText(/55,000 units/)).not.toBeInTheDocument()
  })

  it('explains an incompatible requirement instead of pricing it', async () => {
    const user = await setup()
    await user.click(screen.getByLabelText(/not compatible/i))
    await user.click(screen.getByRole('button', { name: /save requirement/i }))

    expect(
      await screen.findByRole('heading', { name: /no compatible production window/i }),
    ).toBeInTheDocument()
    expect(screen.getByText(/Board grade differs/)).toBeInTheDocument()
  })

  it('waits for supplier confirmation when compatibility is partial', async () => {
    const user = await setup()
    await user.click(screen.getByLabelText(/partial compatibility/i))
    await user.click(screen.getByRole('button', { name: /save requirement/i }))

    expect(await screen.findByText(/Awaiting supplier/)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /^approve$/i }))
    expect(await screen.findByText(/Ready to commit/)).toBeInTheDocument()
  })

  it('announces a validation error and keeps the demo on the form', async () => {
    const user = await setup()
    await user.click(screen.getByLabelText(/validation error/i))
    await user.click(screen.getByRole('button', { name: /save requirement/i }))

    expect(screen.getAllByText(/enter a quantity/i).length).toBeGreaterThan(0)
    expect(screen.getByRole('heading', { name: /nothing searched yet/i })).toBeInTheDocument()
  })

  it('resets back to the starting state', async () => {
    const user = await setup()
    await user.click(screen.getByRole('button', { name: /save requirement/i }))
    await user.click(screen.getAllByRole('button', { name: /commit demo order/i })[0])
    await screen.findByRole('heading', { name: /order executed/i })

    await user.click(screen.getAllByRole('button', { name: /reset demo/i })[0])

    expect(
      await screen.findByRole('heading', { name: /nothing searched yet/i }),
    ).toBeInTheDocument()
    expect(screen.getAllByText(/35,000 units/).length).toBeGreaterThan(0)
  })
})

describe('supplier view', () => {
  it('shows compatible demand without exposing buyer price positions', async () => {
    await setup()

    expect(screen.getByText(/3 requirements, 42,000 units/)).toBeInTheDocument()
    expect(screen.getByText('$6,750.00 of product value')).toBeInTheDocument()
    expect(screen.getByRole('rowheader', { name: 'Buyer A' })).toBeInTheDocument()
    expect(screen.queryByText(/0\.4300/)).not.toBeInTheDocument()
  })

  it('sends the buyer back to review when the supplier cuts capacity', async () => {
    const user = await setup()
    await user.click(screen.getByRole('button', { name: /save requirement/i }))
    await user.click(screen.getByRole('button', { name: /modify capacity/i }))

    expect((await screen.findAllByText(/supplier changed the terms/i)).length).toBeGreaterThan(0)
  })

  it('closes the opportunity when the supplier declines', async () => {
    const user = await setup()
    await user.click(screen.getByRole('button', { name: /save requirement/i }))
    await user.click(screen.getByRole('button', { name: /decline and close/i }))

    expect((await screen.findAllByText(/supplier closed this window/i)).length).toBeGreaterThan(0)
  })
})

describe('page structure', () => {
  it('has one h1 that states what the product does', () => {
    render(<App />)
    const headings = screen.getAllByRole('heading', { level: 1 })
    expect(headings).toHaveLength(1)
    expect(headings[0]).toHaveTextContent(/fill compatible production capacity with committed demand/i)
  })

  it('keeps direction, hypotheses, open questions and boundaries in separate lists', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /recommended direction/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /pilot hypotheses/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /open questions/i })).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 3, name: /what this prototype does not do/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /demo assumptions/i })).toBeInTheDocument()
  })

  it('marks the business model figures as hypotheses', () => {
    render(<App />)
    expect(screen.getAllByText('Hypothesis').length).toBe(3)
    expect(screen.getAllByText(/4 to 6 percent/).length).toBeGreaterThan(0)
  })

  it('never describes the product as artificial intelligence', () => {
    const { container } = render(<App />)
    const text = container.textContent ?? ''
    expect(text).not.toMatch(/\bAI\b/)
    expect(text).not.toMatch(/artificial intelligence/i)
    expect(text).not.toMatch(/guaranteed lowest price/i)
    expect(text).not.toMatch(/risk free/i)
  })
})
