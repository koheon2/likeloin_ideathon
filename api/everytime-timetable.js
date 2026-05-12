const EVERYTIME_URL = 'https://api.everytime.kr/find/timetable/table/friend';

function sendJson(res, status, body) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.status(status).send(JSON.stringify(body));
}

function cleanIdentifier(value) {
  return String(value || '').trim().replace(/^@/, '');
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, { ok: false, error: 'METHOD_NOT_ALLOWED' });
  }

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  } catch (_) {
    return sendJson(res, 400, { ok: false, error: 'INVALID_JSON' });
  }
  const identifier = cleanIdentifier(body.identifier);
  if (!/^[A-Za-z0-9_-]{8,80}$/.test(identifier)) {
    return sendJson(res, 400, { ok: false, error: 'INVALID_IDENTIFIER' });
  }

  try {
    const upstream = await fetch(EVERYTIME_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'User-Agent': 'Mozilla/5.0',
        'Referer': 'https://everytime.kr/',
      },
      body: new URLSearchParams({ identifier }).toString(),
    });

    const xml = await upstream.text();
    if (!upstream.ok) {
      return sendJson(res, 502, {
        ok: false,
        error: 'EVERYTIME_REQUEST_FAILED',
        status: upstream.status,
      });
    }

    if (!xml || !xml.includes('<table')) {
      return sendJson(res, 502, { ok: false, error: 'INVALID_EVERYTIME_RESPONSE' });
    }

    return sendJson(res, 200, { ok: true, identifier, xml });
  } catch (error) {
    return sendJson(res, 502, {
      ok: false,
      error: 'EVERYTIME_PROXY_FAILED',
      message: error && error.message ? error.message : 'Unknown error',
    });
  }
};
