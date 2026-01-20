// @ts-check
import { test, expect } from '@playwright/test';

// รันแบบเรียงลำดับเพื่อให้ค่า createdUserId ถูกส่งต่อไปยังข้ออื่นได้ถูกต้อง
test.describe.configure({ mode: 'serial' });

test.describe('Reqres API Automation (Playwright Version)', () => {
  // ประกาศตัวแปรเพื่อเก็บ ID (Configuration Setup)
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

    // ตรวจสอบ Status Code 201
    expect(response.status()).toBe(201);

    const responseBody = await response.json();
    
    // ตรวจสอบ Response Result (Input Validation)
    expect(responseBody.name).toBe("Suphamongkol Nounjun");
    expect(responseBody.job).toBe("Tester");
    
    // บันทึก ID ไว้ใช้ต่อ
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
    
    // ตรวจสอบผลลัพธ์ข้อมูลพนักงาน
    expect(responseBody.data).toHaveProperty('id', 2);
    expect(responseBody.data.first_name).toBeDefined();
  });

  test('API-03: Update User Info', async ({ request }) => {
    // ใช้ ID ที่ได้จากการ Create ในข้อแรก
    const response = await request.put(`https://reqres.in/api/users/${createdUserId}`, {
      headers: {
        'x-api-key': apiKey,
        'User-Agent': userAgent
      },
      data: {
        name: "Suphamongkol Nounjun",
        job: "Senior Tester" // เปลี่ยน Job เพื่อให้เห็นการ Update
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
    
    // ตรวจสอบ Status 204 (No Content) สำหรับการลบสำเร็จ
    expect(response.status()).toBe(204);
  });

});