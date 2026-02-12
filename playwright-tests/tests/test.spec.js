import { test, expect } from '@playwright/test';

test.describe.configure({ mode: 'parallel' });

test.describe('Reqres API Automation (Playwright Version)', () => {
  let createdUserId = ''; 
  const apiKey = 'reqres_8c75d122f3474e429297351ac4c6a47d';
  const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36';

  test('API-01: Create New User', async ({ request }) => {
    const response = await request.post('https://reqres.in/api/users', {
      headers: {
        'x-api-key': apiKey,
        'User-Agent': userAgent
      },
      data: {
        name: "Suphamongkol Nounjun",
        job: "Tester"
      }
    });

    expect(response.status()).toBe(201);

    const responseBody = await response.json();
    
    
    expect(responseBody.name).toBe("Suphamongkol Nounjun");
    expect(responseBody.job).toBe("Tester");
    

    createdUserId = responseBody.id;
    console.log(`Created User ID: ${createdUserId}`);
  });

  test('API-02: Get Single User', async ({ request }) => {
    const response = await request.get('https://reqres.in/api/users/2', {
      headers: {
        'x-api-key': apiKey,
        'User-Agent': userAgent
      }
    });
    
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    
    expect(responseBody.data).toHaveProperty('id', 2);
    expect(responseBody.data.first_name).toBeDefined();
  });

  test('API-03: Update User Info', async ({ request }) => {
    const response = await request.put(`https://reqres.in/api/users/${createdUserId}`, {
      headers: {
        'x-api-key': apiKey,
        'User-Agent': userAgent
      },
      data: {
        name: "Suphamongkol Nounjun",
        job: "Senior Tester"
      }
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    
    expect(responseBody.name).toBe("Suphamongkol Nounjun");
    expect(responseBody.job).toBe("Senior Tester");
  });

  test('API-04: Delete User', async ({ request }) => {
    const response = await request.delete(`https://reqres.in/api/users/${createdUserId}`, {
      headers: {
        'x-api-key': apiKey,
        'User-Agent': userAgent
      }
    });
    
    expect(response.status()).toBe(204);
  });

});