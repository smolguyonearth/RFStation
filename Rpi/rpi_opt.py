# -*- coding: utf-8 -*-

import serial
import requests
import time
from Queue import Queue
from threading import Thread

SERIAL_PORT = '/dev/serial0'
BAUD_RATE = 9600

BACKEND_URL = 'http://10.233.11.176:3000/api/ingest'

payload_queue = Queue()


def sender():
    session = requests.Session()

    while True:
        payload = payload_queue.get()

        try:
            start = time.time()

            res = session.post(
                BACKEND_URL,
                json=payload,
                timeout=2
            )

            elapsed = (time.time() - start) * 1000

            print "[HTTP]", res.status_code, "(" + str(round(elapsed, 1)) + " ms)"

            if res.status_code != 200:
                print "[BACKEND]", res.text

        except requests.exceptions.RequestException as e:
            print "[HTTP ERROR]", str(e)

        payload_queue.task_done()


# Start sender thread
t = Thread(target=sender)
t.daemon = True
t.start()

try:
    ser = serial.Serial(
        SERIAL_PORT,
        BAUD_RATE,
        timeout=0.1
    )

    print "Listening on", SERIAL_PORT

except Exception as e:
    print "Failed to open serial port:", str(e)
    raise


while True:
    try:
        line = ser.readline()

        if not line:
            continue

        line = line.decode('utf-8', 'ignore').strip()

        print "[SERIAL]", line

        parts = line.split(',')

        payload = None

        # Format:
        # DEVICE_CODE,NEAREST_DEVICE,RSSI
        # nearest_device also serves as zone_code
        if len(parts) == 3:
            try:
                payload = {
                    'device_code': parts[0],
                    'nearest_device': parts[1],
                    'rssi': int(parts[2]),
                    'zone_code': parts[1]
                }

            except ValueError:
                print "[PARSE ERROR] Invalid RSSI:", line

        else:
            print "[PARSE ERROR] Unexpected format:", line
            continue

        if payload:
            payload_queue.put(payload)

    except KeyboardInterrupt:
        print "\nStopping..."
        break

    except Exception as e:
        print "[ERROR]", str(e)
        time.sleep(0.1)