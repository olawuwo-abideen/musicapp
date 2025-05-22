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

// Load song IDs from a JSON file
const songIds = new SharedArray('songs ids', function () {
  return JSON.parse(open('./songs.json')).ids;
});

export const options = {
  vus: 50, // Maximum number of virtual users
  // duration: '25m', // Total duration of the test

  thresholds: {
    http_req_duration: ['p(95)<1000'], // 95% of requests should be below 1000ms
    failed_requests: ['rate<0.1'], // Less than 10% of requests should fail
  },

  stages: [
    { duration: '1m', target: 100 }, // Ramp up to 100 users over 2 minutes
    { duration: '5m', target: 100 }, // Stay at 100 users for 5 minutes
    { duration: '2m', target: 200 }, // Ramp up to 200 users over 2 minutes
    { duration: '5m', target: 200 }, // Stay at 200 users for 5 minutes
    { duration: '2m', target: 300 }, // Ramp up to 300 users over 2 minutes
    { duration: '5m', target: 300 }, // Stay at 300 users for 5 minutes
    { duration: '2m', target: 0 }, // Ramp down to 0 users over 2 minutes
  ],
};

const BASE_URL = 'http://localhost:3000';

export default function () {
  // GET all songs (40% of requests)
  if (Math.random() < 0.4) {
    const response = http.get(`${BASE_URL}/song`, { headers });
    check(response, {
      'get all songs status was 200': (r) => r.status == 200,
    });
    failureRate.add(response.status !== 200);
    sleep(1);
  }

  // GET single song (20% of requests)
  else if (Math.random() < 0.6) {
    const songId = songIds[Math.floor(Math.random() * songIds.length)];
    const response = http.get(`${BASE_URL}/song/${songId}`, { headers });
    check(response, {
      'get single song status was 200': (r) => r.status == 200,
    });
    failureRate.add(response.status !== 200);
    sleep(1);
  }

  // PATCH update song (40% of requests to simulate many updates)
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

  sleep(1);
}


}
