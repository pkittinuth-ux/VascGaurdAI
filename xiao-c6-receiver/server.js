import express from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import mqtt from 'mqtt';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3001;
const MQTT_BROKER = process.env.MQTT_BROKER || 'mqtt://broker.hivemq.com:1883';
const MQTT_TOPIC = process.env.MQTT_TOPIC || 'tensai/max30102/+/telemetry';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Telemetry state store
let latestTelemetry = null;
const history = [];
const maxHistory = 100;
const knownDevices = new Map();
let packetCount = 0;
let mqttStatus = 'connecting';
let lastPacketTime = null;

// Connect to HiveMQ MQTT Broker
console.log(`[MQTT] Connecting to ${MQTT_BROKER}...`);
const client = mqtt.connect(MQTT_BROKER, {
  clientId: 'xiao-c6-receiver-' + Math.random().toString(16).substring(2, 8),
  clean: true,
  reconnectPeriod: 3000,
  connectTimeout: 10000,
});

client.on('connect', () => {
  mqttStatus = 'connected';
  console.log(`[MQTT] Connected to HiveMQ Broker (${MQTT_BROKER})`);
  client.subscribe(MQTT_TOPIC, (err) => {
    if (err) {
      console.error(`[MQTT] Subscription error on ${MQTT_TOPIC}:`, err);
    } else {
      console.log(`[MQTT] Subscribed to topic: ${MQTT_TOPIC}`);
    }
  });
  broadcastState();
});

client.on('reconnect', () => {
  mqttStatus = 'reconnecting';
  console.log('[MQTT] Reconnecting to HiveMQ...');
  broadcastState();
});

client.on('offline', () => {
  mqttStatus = 'offline';
  console.log('[MQTT] HiveMQ Client is offline');
  broadcastState();
});

client.on('error', (err) => {
  mqttStatus = 'error';
  console.error('[MQTT] Connection error:', err.message);
  broadcastState();
});

client.on('message', (topic, payloadBuffer) => {
  const rawString = payloadBuffer.toString();
  packetCount++;
  lastPacketTime = new Date().toISOString();

  // Extract deviceId from topic: tensai/max30102/<deviceId>/telemetry
  const parts = topic.split('/');
  const deviceId = parts[2] || 'unknown-device';

  let parsed = null;
  try {
    parsed = JSON.parse(rawString);
  } catch (err) {
    parsed = { raw: rawString, parseError: true };
  }

  const record = {
    id: packetCount,
    topic,
    deviceId,
    receivedAt: lastPacketTime,
    data: parsed,
  };

  latestTelemetry = record;
  history.push(record);
  if (history.length > maxHistory) {
    history.shift();
  }

  // Update known devices map
  knownDevices.set(deviceId, {
    deviceId,
    lastSeen: lastPacketTime,
    lastSpo2: parsed.spo2,
    lastHeartRate: parsed.heart_rate,
    lastTemp: parsed.board_temp_c,
    uptimeMs: parsed.uptime_ms,
    packetsReceived: (knownDevices.get(deviceId)?.packetsReceived || 0) + 1,
  });

  console.log(`[RX #${packetCount}] Device: ${deviceId} | HR: ${parsed.heart_rate} bpm | SpO2: ${parsed.spo2}% | Temp: ${parsed.board_temp_c}°C`);

  // Broadcast to all WebSocket clients
  broadcast({
    type: 'TELEMETRY_PACKET',
    payload: record,
    status: getSystemStatus(),
  });
});

function getSystemStatus() {
  return {
    mqttStatus,
    broker: MQTT_BROKER,
    subscribedTopic: MQTT_TOPIC,
    packetCount,
    lastPacketTime,
    activeDeviceCount: knownDevices.size,
    uptimeSeconds: Math.floor(process.uptime()),
  };
}

function broadcast(msgObj) {
  const json = JSON.stringify(msgObj);
  wss.clients.forEach((clientWs) => {
    if (clientWs.readyState === WebSocket.OPEN) {
      clientWs.send(json);
    }
  });
}

function broadcastState() {
  broadcast({
    type: 'STATUS_UPDATE',
    status: getSystemStatus(),
  });
}

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('[WS] New frontend client connected');
  ws.send(
    JSON.stringify({
      type: 'INIT_STATE',
      status: getSystemStatus(),
      latest: latestTelemetry,
      history: history.slice(-30),
      devices: Array.from(knownDevices.values()),
    })
  );

  ws.on('close', () => {
    console.log('[WS] Frontend client disconnected');
  });
});

// REST API Endpoints
app.get('/api/status', (req, res) => {
  res.json(getSystemStatus());
});

app.get('/api/telemetry/latest', (req, res) => {
  if (!latestTelemetry) {
    return res.status(204).json({ message: 'No telemetry received yet from XIAO ESP32-C6' });
  }
  res.json(latestTelemetry);
});

app.get('/api/telemetry/history', (req, res) => {
  res.json(history);
});

app.get('/api/devices', (req, res) => {
  res.json(Array.from(knownDevices.values()));
});

// Simulate / inject test packet
app.post('/api/simulate', (req, res) => {
  const { deviceId = 'xiao-c6-DEMO', spo2 = 98, heartRate = 72, boardTemp = 32.4 } = req.body || {};
  const mockPayload = {
    spo2: Number(spo2),
    heart_rate: Number(heartRate),
    board_temp_c: boardTemp ? String(boardTemp) : null,
    uptime_ms: Date.now() % 10000000,
  };

  const topic = `tensai/max30102/${deviceId}/telemetry`;
  // Trigger internal message handler
  client.emit('message', topic, Buffer.from(JSON.stringify(mockPayload)));

  res.json({ success: true, message: 'Simulated packet ingested', packet: mockPayload });
});

// Publish test packet to real HiveMQ broker
app.post('/api/publish-test', (req, res) => {
  const deviceId = req.body?.deviceId || 'xiao-c6-testbench';
  const topic = `tensai/max30102/${deviceId}/telemetry`;
  const payload = JSON.stringify({
    spo2: Math.floor(95 + Math.random() * 4),
    heart_rate: Math.floor(68 + Math.random() * 15),
    board_temp_c: (31.5 + Math.random() * 2).toFixed(2),
    uptime_ms: Date.now() % 10000000,
  });

  client.publish(topic, payload, false, (err) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    res.json({ success: true, publishedTopic: topic, payload: JSON.parse(payload) });
  });
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 XIAO ESP32-C6 Telemetry Bridge Running on:`);
  console.log(`   ➜ http://localhost:${PORT}`);
  console.log(`   ➜ WebSocket: ws://localhost:${PORT}`);
  console.log(`   ➜ Subscribed to: ${MQTT_TOPIC}`);
  console.log(`=======================================================`);
});

