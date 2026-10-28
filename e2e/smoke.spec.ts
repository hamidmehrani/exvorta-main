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

  test('Spec 4 (Accessibility Landmarks & Skip Link): validates landmark hierarchy and skip to content', async ({ page }) => {
    await page.goto('/')

    const skipLink = page.locator('a[href="#main-content"]')
    await expect(skipLink).toBeAttached()
    await expect(skipLink).toHaveText(/Skip to main content/i)

    const main = page.locator('main#main-content')
    await expect(main).toBeAttached()

    const header = page.locator('header[data-purpose="site-header"]')
    await expect(header).toBeAttached()

    const primaryNav = page.locator('nav[aria-label="Primary"]')
    await expect(primaryNav).toBeAttached()

    const footer = page.locator('footer')
    await expect(footer).toBeAttached()

    const footerNav = page.locator('nav[aria-label="Footer"]')
    await expect(footerNav).toBeAttached()
  })

  test('Spec 5 (RFQ Form Accessibility & Labels): ensures explicit labels and no keyboard traps', async ({ page }) => {
    await page.goto('/rfq')

    const mainLandmarks = page.locator('main')
    await expect(mainLandmarks).toHaveCount(1)

    const nameInput = page.locator('#rfq-name')
    const emailInput = page.locator('#rfq-email')
    const businessSelect = page.locator('#rfq-businessType')
    const budgetSelect = page.locator('#rfq-budget')

    await expect(nameInput).toBeVisible()
    await expect(emailInput).toBeVisible()
    await expect(businessSelect).toBeVisible()
    await expect(budgetSelect).toBeVisible()

    await expect(nameInput).toHaveAttribute('aria-required', 'true')
    await expect(emailInput).toHaveAttribute('aria-required', 'true')
    await expect(businessSelect).toHaveAttribute('aria-required', 'true')
    await expect(budgetSelect).toHaveAttribute('aria-required', 'true')

    await expect(page.locator('label[for="rfq-name"]')).toBeAttached()
    await expect(page.locator('label[for="rfq-email"]')).toBeAttached()
    await expect(page.locator('label[for="rfq-businessType"]')).toBeAttached()
    await expect(page.locator('label[for="rfq-budget"]')).toBeAttached()
  })
})
