import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';
import { SharedArray } from 'k6/data';

const failureRate = new Rate('failed_requests');

// Read Bearer token from config file
const token = JSON.parse(open('./config.json')).token;

// Common headers
const headers = {
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
};

// Load product IDs from a JSON file
const songIds = new SharedArray('songs ids', function () {
  return JSON.parse(open('./songs.json')).ids;
});

export const options = {
  vus: 100, // Number of virtual users
  // duration: '4h', // Total duration of the test

  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
    failed_requests: ['rate<0.05'], // Less than 5% of requests should fail over long period
  },

  stages: [
    { duration: '5m', target: 100 }, // Ramp up to 100 users over 5 minutes
    { duration: '3h50m', target: 100 }, // Stay at 100 users for 3 hours and 50 minutes
    { duration: '5m', target: 0 }, // Ramp down to 0 users over 5 minutes
  
],
};

const BASE_URL = 'http://localhost:3000';

export default function () {
  // GET all songs (50% of requests)
  if (Math.random() < 0.5) {
    const response = http.get(`${BASE_URL}/song`, { headers });
    check(response, {
      'get all songs status was 200': (r) => r.status == 200,
    });
    failureRate.add(response.status !== 200);
    sleep(1);
  }

  // GET single product (40% of requests)
  else if (Math.random() < 0.9) {
    const songId = songIds[Math.floor(Math.random() * songIds.length)];
    const response = http.get(`${BASE_URL}/song/${songId}`, { headers });
    check(response, {
      'get single song status was 200': (r) => r.status == 200,
    });
    failureRate.add(response.status !== 200);
    sleep(1);
  }

  // PATCH update song (10% of requests to simulate occasional purchases)
  else {
    const songId = songIds[Math.floor(Math.random() * songIds.length)];
  
    const payload = JSON.stringify({
      title: 'Updated Title',
      artists: 'Updated Artist',
      releasedDate: '2019-11-29T00:00:00.000Z',
      duration: '00:03:22', 
      genre: 'pop' 
    });
  
    const response = http.put(`${BASE_URL}/song/${songId}`, payload, { headers });
  
    check(response, {
      'update song status was 200': (r) => r.status === 200,
    });
  
    failureRate.add(response.status !== 200);
  
    if (response.status !== 200) {
      console.error(`Put failed for ID ${songId}: ${response.status}\n${response.body}`);
    }
  
    sleep(2);
  }
}
