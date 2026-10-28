import { test, expect } from '@playwright/test'

test.beforeEach(() => {
  test.skip(
    !process.env.PREVIEW_URL,
    'PREVIEW_URL is not set — skipping preview smoke e2e (UNVERIFIED)'
  )
})

test.describe('E2E Preview Smoke Suite', () => {
  test('Spec 1 (Home & Nav): renders header and primary navigation links', async ({ page }) => {
    await page.goto('/')

    const header = page.locator('header[data-purpose="site-header"]')
    await expect(header).toBeVisible()

    const navLinks = ['EXVORTA WEB', 'PORTFOLIO', 'ECOSYSTEM', 'THE FIRM']
    for (const label of navLinks) {
      const link = header.getByRole('link', { name: new RegExp(`^${label}$`, 'i') })
      await expect(link).toBeAttached()
      await expect(link).toBeVisible()
    }
  })

  test('Spec 2 (RFQ Embed): loads catalog and increments selected item count', async ({ page }) => {
    await page.goto('/rfq/embed?catalog=example')

    await expect(page.getByRole('heading', { name: 'Standard Export Catalog' })).toBeVisible()

    const counter = page.getByText(/item.*selected/i)
    await expect(counter).toContainText('0 items selected')

    const incrementBtn = page.locator('button[aria-label*="Increase quantity"]').first()
    await expect(incrementBtn).toBeVisible()
    await incrementBtn.click()

    await expect(counter).toContainText('1 item selected')
  })

  test('Spec 3 (Contact Form Validation): enforces required fields', async ({ page }) => {
    await page.goto('/contact')

    const nameInput = page.locator('#name')
    const emailInput = page.locator('#email')
    const messageInput = page.locator('#message')
    const submitBtn = page.getByRole('button', { name: '[ Send message ]' })

    await expect(nameInput).toBeVisible()
    await expect(emailInput).toBeVisible()
    await expect(messageInput).toBeVisible()
    await expect(submitBtn).toBeVisible()

    await expect(nameInput).toHaveAttribute('required', '')
    await expect(emailInput).toHaveAttribute('required', '')
    await expect(messageInput).toHaveAttribute('required', '')

    await submitBtn.click()

    const isNameInvalid = await nameInput.evaluate((el: HTMLInputElement) => el.validity.valueMissing)
    expect(isNameInvalid).toBe(true)

    await expect(page.getByText(/Message sent/i)).not.toBeVisible()
  })
})
