import serial
import requests
import time

ser = serial.Serial('/dev/serial0', 9600, timeout=1)

BACKEND_URL = "http://10.233.11.176:3000/api/ingest"

while True:
    line = ser.readline().decode('utf-8').strip()
    if line:
        print("From Calliope:", line)
        parts = line.split(',')
        
        # Support both 3-part (device, nearest, rssi) and 4-part (zone/reader, device, nearest, rssi) formats
        payload = None
        if len(parts) == 4:
            try:
                payload = {
                    "device_code": parts[1],
                    "nearest_device": parts[2],
                    "rssi": int(parts[3]),
                    "zone_code": parts[0]  # E.g. "AR" as the zone/reader code
                }
            except ValueError as ve:
                print("Error parsing RSSI from 4-part message:", ve)
        elif len(parts) == 3:
            try:
                payload = {
                    "device_code": parts[0],
                    "nearest_device": parts[1],
                    "rssi": int(parts[2]),
                    "zone_code": "ZONE_A"
                }
            except ValueError as ve:
                print("Error parsing RSSI from 3-part message:", ve)
        
        if payload:
            print("Sending payload:", payload)
            try:
                res = requests.post(BACKEND_URL, json=payload, timeout=2)
                print("Status Code:", res.status_code, "Response:", res.text)
                if res.status_code == 200:
                    print("Sent to WebApp!")
                else:
                    print("Backend rejected request!")
            except requests.exceptions.RequestException as e:
                print("Failed to send:", e)

# tx=pin0, rx=pin1 in calliope side