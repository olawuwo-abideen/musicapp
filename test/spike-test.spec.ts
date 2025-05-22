import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const failureRate = new Rate('failed_requests');

// Read Bearer token from config file
const token = JSON.parse(open('./config.json')).token;

// Common headers
const headers = {
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
};

// Load song IDs from a JSON file
// const songIds = new SharedArray('songs ids', function () {
//   return JSON.parse(open('./songs.json')).ids;
// });

export const options = {
  vus: 1000, // Maximum number of virtual users
  // duration: '10m', // Total duration of the test

  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests should be below 2000ms during spike
    failed_requests: ['rate<0.2'], // Less than 20% of requests should fail during spike
  },

  stages: [
    { duration: '1m', target: 100 }, // Ramp up to 100 users over 1 minute
    { duration: '2m', target: 100 }, // Stay at 100 users for 2 minutes
    { duration: '30s', target: 1000 }, // Spike to 1000 users over 30 seconds
    { duration: '1m', target: 1000 }, // Stay at 1000 users for 1 minute
    { duration: '2m', target: 100 }, // Scale down to 100 users over 2 minutes
    { duration: '1m', target: 0 }, // Ramp down to 0 users over 1 minute
  ],
};

const BASE_URL = 'http://localhost:3000';

export default function () {
  // GET all songs (simulating spike in traffic when a users fetched songs)
  const response = http.get(`${BASE_URL}/song`, { headers });
  check(response, {
    'get songs status was 200': (r) => r.status == 200,
  });
  failureRate.add(response.status !== 200);
  sleep(1);
}
