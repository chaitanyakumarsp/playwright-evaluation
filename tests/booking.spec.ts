import { test, expect } from '@playwright/test';
import {ApiUtils} from "./api-utils/ApiUtils";

let bookingId: number;
let authToken: string;

const expectedFirstname: string = 'John';
const expectedLastname: string = 'Doe';

test.describe('Booking Tests', () => {
  test.beforeAll(async () => {
    console.log('Booking Tests: creating booking and auth token');
    const apiUtils: ApiUtils = new ApiUtils();
    const result: { token: string; bookingId: number } = await apiUtils.createBooking();
    bookingId = result.bookingId;
    authToken = result.token;
    console.log(`Booking Tests: created bookingId=${bookingId}, authToken=${authToken}`);
  });

  test('Test @api GET booking by ID and assert firstname and lastname', async ({ request }) => {
    console.log(`Booking API: fetching booking by ID ${bookingId}`);
    const response = await request.get(`https://restful-booker.herokuapp.com/booking/${bookingId}`);
    console.log(`Booking API: response status ${response.status()}`);
    expect(response.status()).toBe(200);
    const booking = await response.json();
    console.log(`Booking API: booking firstname='${booking.firstname}', lastname='${booking.lastname}'`);
    expect(booking.firstname).toBe(expectedFirstname);
    expect(booking.lastname).toBe(expectedLastname);
  });

  test('@web Test inject token into localStorage and assert page contains firstname', async ({ page }) => {
    console.log(`Booking Web: injecting auth token into localStorage for bookingId=${bookingId}`);
    await page.addInitScript((token: string) => {
      window.localStorage.setItem('token', token);
    }, authToken);

    await page.goto('https://restful-booker.herokuapp.com/');
    console.log('Booking Web: navigated to homepage');

    const bodyText: string = await page.evaluate(async (id: number) => {
      const token: string = window.localStorage.getItem('token') ?? '';
      console.log('Booking Web: token read from localStorage', token);
      const response = await fetch(`/booking/${id}`, {
        headers: { Accept: 'application/json', Cookie: `token=${token}` },
      });
      console.log('Booking Web: fetched booking from page script, status', response.status);
      return response.text();
    }, bookingId);

    console.log(`Booking Web: response body length ${bodyText.length}`);
    expect(bodyText).toContain(expectedFirstname);
  });
});
