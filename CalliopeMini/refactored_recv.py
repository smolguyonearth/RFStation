from calliopemini import *
import radio
# import neopixel
import utime
from machine import time_pulse_us

#init uart
uart.init(baudrate=9600, tx=pin0, rx=pin1)

#init radio
radio.on()
radio.config(group=10, power=7)

#init neopixel
# np = neopixel.NeoPixel(pin_RGB, 3)

#init ultrasonic (HC-SR04)
TRIG_PIN = pin2          # adjust to your actual wiring
ECHO_PIN = pin3          # adjust to your actual wiring
# ---

#General parameters

DEVICE_ID = "P1"

SCAN_TIME = 5000
WINDOW_SIZE = 10
MIN_PACKETS = 3
MIN_RSSI = -65

#Zone shifting parameters
SWITCH_MARGIN = 4

#Ultrasonic parameters
THRESHOLD_CM = 5.0       # distance considered "object present"
US_BUFFER_SIZE = 5       # number of samples in buffer
US_TRIGGER_RATIO = 0.6   # 60% of buffer must be < threshold to trigger
# ---

#Memory Allocation
current_device = None

last_zone = None
last_rssi = -999

# RSSI storage
rssi_window = {}
previous_rssi = {}

# Ultrasonic state
us_buffer = [999.0] * US_BUFFER_SIZE
us_index = 0
was_triggered = False
# ---

#median function
def median(values):
    values = values[:]
    values.sort()

    n = len(values)

    if n == 0:
        return -999

    if n % 2:
        return values[n//2]

    return (values[n//2-1] + values[n//2]) / 2
# ---

#ultrasonic functions
def read_distance():
    """Read distance from HC-SR04 (cm) — returns -1 if no reading"""
    TRIG_PIN.write_digital(0)
    utime.sleep_us(2)
    TRIG_PIN.write_digital(1)
    utime.sleep_us(10)
    TRIG_PIN.write_digital(0)

    # Wait for echo pin to go HIGH (start of pulse)
    t0 = utime.ticks_us()
    while ECHO_PIN.read_digital() == 0:
        if utime.ticks_diff(utime.ticks_us(), t0) > 30000:
            return -1   # timeout

    # Measure how long echo stays HIGH
    pulse_start = utime.ticks_us()
    while ECHO_PIN.read_digital() == 1:
        if utime.ticks_diff(utime.ticks_us(), pulse_start) > 30000:
            return -1   # timeout

    duration = utime.ticks_diff(utime.ticks_us(), pulse_start)
    return duration * 0.0343 / 2.0

def is_object_near():
    """Check if an object is nearby using buffer ratio"""
    close = 0
    valid = 0
    for d in us_buffer:
        if 0 < d < 999:
            valid += 1
            if d < THRESHOLD_CM:
                close += 1
    if valid == 0:
        return False
    return (close / valid) >= US_TRIGGER_RATIO
# ---

#main
display.show(Image.SQUARE_SMALL)

# np.fill((30,30,0))
# np.show()

while True:
    # --- Ultrasonic: read distance every loop and fill buffer ---
    d = read_distance()
    if d > 0:
        us_buffer[us_index] = d
        us_index = (us_index + 1) % US_BUFFER_SIZE

    triggered = is_object_near()

    # --- Debug: print distance + trigger state to serial ---
    # if d > 0:
    #     print(str(d) + " cm")
    # else:
    #     print("no read")

    # if triggered and not was_triggered:
    #     print("TRIGGERED | " + str(d) + " cm")
    # elif not triggered and was_triggered:
    #     print("RELEASED")

    # --- Trigger: when object "just entered" (edge detection) ---
    # [BUTTON DISABLED] originally used button A:
    # if button_a.was_pressed():
    if triggered and not was_triggered:
        was_triggered = True

        rssi_window = {} #clear

        display.show(Image.TARGET) #start scanning
        # np.fill((30,0,30))
        # np.show()

        #scanning
        start = utime.ticks_ms()

        while utime.ticks_diff(utime.ticks_ms(),start) < SCAN_TIME:

            packet = radio.receive_full()

            if packet:
                payload = packet[0]
                rssi = packet[1]

                #payload is 2 bytes: device ID + sequence number
                if len(payload) == 2:
                    device = chr(payload[0])

                    #Keeping like this: {"A": [-60, -62, ...], "B": [-70, -72, ...]}

                    # Create a new list for the device if it doesn't exist
                    if device not in rssi_window:
                        rssi_window[device] = []
                    
                    #Append the RSSI value to the device's list
                    rssi_window[device].append(rssi)

                    if len(rssi_window[device]) > WINDOW_SIZE:
                        rssi_window[device].pop(0)
            sleep(5)

        # Calculate median RSSI for each device with at least MIN_PACKETS samples
        current_rssi = {}

        for dev in rssi_window:
            samples = rssi_window[dev]

            if len(samples) >= MIN_PACKETS:
                value = median(samples)

                if value >= MIN_RSSI:
                    current_rssi[dev] = value

        #init winner and winner_rssi for comparison
        winner = None
        winner_rssi = -999

        for dev in current_rssi:
            if current_rssi[dev] > winner_rssi:

                winner_rssi = current_rssi[dev]
                winner = dev

        #zone locking logic

        if winner is not None:

            # First detection
            if current_device is None:
                current_device = winner

            # Still inside same zone
            elif winner == current_device:
                pass 
                
            # Possible border crossing
            else:
                current_zone_rssi = current_rssi.get(current_device, -999)

                diff = winner_rssi - current_zone_rssi

                if diff >= SWITCH_MARGIN:
                    current_device = winner
        else:
            current_device = None

        #output
        if current_device is not None:
            display.show(current_device)
            # np.fill((0,50,0))
            # np.show()

            best_rssi = current_rssi.get(current_device, -999)

            last_zone = current_device
            last_rssi = best_rssi
            
            uart.write(
                DEVICE_ID + "," +
                current_device + "," +
                str(best_rssi) + "\n"
            )

        else:
            last_zone = None
            last_rssi = -999

            display.show(Image.NO)

            # np.fill((50,0,0))
            # np.show()

            # in case no device is detected
            uart.write(
                DEVICE_ID + ",NONE,-999\n"
            )

    # --- Reset trigger when object leaves ---
    if not triggered:
        was_triggered = False

    if last_zone is not None:
        uart.write(
            DEVICE_ID + "," +
            last_zone + "," +
            str(last_rssi) + "\n"
        )
    else:
        uart.write(
            DEVICE_ID + ",NONE,-999\n"
        )
                
    sleep(50)  # faster than before (50ms) so ultrasonic buffer updates in time