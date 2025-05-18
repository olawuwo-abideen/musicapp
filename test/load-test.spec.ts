import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';
import { SharedArray } from 'k6/data';

// Track failed requests
const failureRate = new Rate('failed_requests');

// Read Bearer token from config file
const token = JSON.parse(open('./config.json')).token;

// Common headers
const headers = {
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
};

// Load song IDs from songs.json
const songIds = new SharedArray('song ids', function () {
  return JSON.parse(open('./songs.json')).ids;
});

export const options = {
  vus: 50,
  thresholds: {
    http_req_duration: ['p(95)<500'],
    failed_requests: ['rate<0.1'],
  },
  stages: [
    { duration: '1m', target: 50 },
    { duration: '3m', target: 50 },
    { duration: '1m', target: 0 },
  ],
};

const BASE_URL = 'http://localhost:3000';

export default function () {
  // 60%: GET all songs
  if (Math.random() < 0.6) {
    const res = http.get(`${BASE_URL}/song`, { headers });
    check(res, { 'get all songs status was 200': (r) => r.status === 200 });
    failureRate.add(res.status !== 200);
    sleep(2);
  }

  // 30%: GET single song
  else if (Math.random() < 0.9) {
    const songId = songIds[Math.floor(Math.random() * songIds.length)];
    const res = http.get(`${BASE_URL}/song/${songId}`, { headers });
    check(res, { 'get single song status was 200': (r) => r.status === 200 });
    failureRate.add(res.status !== 200);
    sleep(2);
  }

  // 10%: POST create new song
  else {
    const payload = JSON.stringify({
      title: 'live',
      artists: 'doe',
      releasedDate: '2019-11-29T00:00:00.000Z',
      duration: '00:03:22',
      genre: 'pop',
    });
    const res = http.post(`${BASE_URL}/song`, payload, { headers });
    check(res, { 'create song status was 201': (r) => r.status === 201 });
    failureRate.add(res.status !== 201);
    sleep(3);
  }
}
