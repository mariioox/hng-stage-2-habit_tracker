import { test, expect } from '@playwright/test';

test.describe('Habit Tracker app', () => {
  
  test.beforeEach(async ({ page }) => {
    // Start every test with a clean slate of local storage
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('shows the splash screen and redirects unauthenticated users to /login', async ({ page }) => {
    await page.goto('/');
    // Check for specific splash screen test ID
    await expect(page.getByTestId('splash-screen')).toBeVisible();
    // Wait for the redirect delay (approx 1.5s)
    await expect(page).toHaveURL(/\/login/);
  });

  test('redirects authenticated users from / to /dashboard', async ({ page }) => {
    await page.goto('/login');
    // Inject a session manually to simulate being logged in
    await page.evaluate(() => {
      localStorage.setItem('habit-tracker-session', JSON.stringify({ userId: '123', email: 'test@test.com' }));
    });
    await page.goto('/');
    await expect(page.getByTestId('splash-screen')).toBeVisible();
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('prevents unauthenticated access to /dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    // AuthGuard should trigger
    await expect(page).toHaveURL(/\/login/);
  });

  test('signs up a new user and lands on the dashboard', async ({ page }) => {
    await page.goto('/signup');
    await page.getByLabel(/email/i).fill('newuser@test.com');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /sign up/i }).click();
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByTestId('dashboard-page')).toBeVisible();
  });

  test("logs in an existing user and loads only that user's habits", async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('habit-tracker-users', JSON.stringify([{ email: 'user1@test.com', password: 'password123', id: 'u1' }]));
      localStorage.setItem('habit-tracker-habits', JSON.stringify([{ id: 'h1', userId: 'u1', name: 'User 1 Habit', completions: [] }]));
    });
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('user1@test.com');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /login/i }).click();
    
    await expect(page.getByTestId('habit-card-user-1-habit')).toBeVisible();
  });

  test('creates a habit from the dashboard', async ({ page }) => {
    // Standard login bypass for speed
    await page.evaluate(() => {
      localStorage.setItem('habit-tracker-session', JSON.stringify({ userId: 'u1', email: 'u1@test.com' }));
    });
    await page.goto('/dashboard');
    await page.getByTestId('create-habit-button').click();
    await page.getByLabel(/habit name/i).fill('Drink Water');
    await page.getByRole('button', { name: /save/i }).click();
    
    await expect(page.getByTestId('habit-card-drink-water')).toBeVisible();
  });

  test('completes a habit for today and updates the streak', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('habit-tracker-session', JSON.stringify({ userId: 'u1', email: 'u1@test.com' }));
      localStorage.setItem('habit-tracker-habits', JSON.stringify([{ 
        id: 'h1', userId: 'u1', name: 'Exercise', completions: [] 
      }]));
    });
    await page.goto('/dashboard');
    await page.getByTestId('habit-complete-exercise').click();
    await expect(page.getByTestId('habit-streak-exercise')).toHaveText(/1 Day Streak/);
  });

  test('persists session and habits after page reload', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('habit-tracker-session', JSON.stringify({ userId: 'u1', email: 'u1@test.com' }));
      localStorage.setItem('habit-tracker-habits', JSON.stringify([{ 
        id: 'h1', userId: 'u1', name: 'Reading', completions: [] 
      }]));
    });
    await page.goto('/dashboard');
    await page.reload();
    await expect(page.getByTestId('habit-card-reading')).toBeVisible();
    await expect(page.getByText(/u1@test.com/)).toBeVisible();
  });

  test('logs out and redirects to /login', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('habit-tracker-session', JSON.stringify({ userId: 'u1', email: 'u1@test.com' }));
    });
    await page.goto('/dashboard');
    await page.getByTestId('auth-logout-button').click();
    await expect(page).toHaveURL(/\/login/);
    const session = await page.evaluate(() => localStorage.getItem('habit-tracker-session'));
    expect(session).toBeNull();
  });

  test('loads the cached app shell when offline after the app has been loaded once', async ({ context, page }) => {
    // Visit the page while online
    await page.goto('/login');
    
    await page.waitForFunction(() => {
      return navigator.serviceWorker.controller !== null;
    });
    
    // Delay to ensure the cache.put operations finished
    await page.waitForTimeout(2000);

    // Go offline
    await context.setOffline(true);
    
    // Reload - should now be served by SW
    await page.reload();

    // Check if the UI is still there
    // Ensure this matches your heading text exactly
    await expect(page.getByRole('heading', { name: /login/i })).toBeVisible();
  });
});