import { request } from '@playwright/test';

const BASE_URL = 'https://restful-booker.herokuapp.com';

interface TokenResponse {
  token: string;
}

interface BookingDates {
  checkin: string;
  checkout: string;
}

interface BookingPayload {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: BookingDates;
  additionalneeds: string;
}

interface CreateBookingResponse {
  bookingid: number;
  booking: BookingPayload;
}

export class ApiUtils {
  async getToken(): Promise<string> {
    const context = await request.newContext({ baseURL: BASE_URL });
    const response = await context.post('/auth', {
      data: { username: 'admin', password: 'password123' },
    });
    const body: TokenResponse = await response.json();
    console.log('API Utils: auth token response status =', response.status());
    console.log('API Utils: auth token response body =', body);
    await context.dispose();
    return body.token;
  }

  async createBooking(): Promise<{ token: string; bookingId: number }> {
    const token = await this.getToken();
    const context = await request.newContext({ baseURL: BASE_URL });

    const payload: BookingPayload = {
      firstname: 'John',
      lastname: 'Doe',
      totalprice: 150,
      depositpaid: true,
      bookingdates: { checkin: '2026-08-01', checkout: '2026-08-05' },
      additionalneeds: 'Breakfast',
    };

    const response = await context.post('/booking', {
      data: payload,
    });

    const body: CreateBookingResponse = await response.json();
    console.log('API Utils: create booking response status =', response.status());
    console.log('API Utils: create booking response body =', body);
    console.log('API Utils: created booking ID =', body.bookingid);
    await context.dispose();
    return { token, bookingId: body.bookingid };
  }
}
