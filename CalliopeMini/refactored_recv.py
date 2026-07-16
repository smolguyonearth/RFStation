from calliopemini import *
import radio
import neopixel
import utime

#init uart
uart.init(baudrate=9600, tx=pin0, rx=pin1)

#init radio
radio.on()
radio.config(group=10, power=7)

#init neopixel
np = neopixel.NeoPixel(pin_RGB, 3)
# ---

#General parameters

DEVICE_ID = "P1"

SCAN_TIME = 5000
WINDOW_SIZE = 10
MIN_PACKETS = 3
MIN_RSSI = -65

#Zone shifting parameters
SWITCH_MARGIN = 4
# ---

#Memory Allocation
current_device = None

last_zone = None
last_rssi = -999

# RSSI storage
rssi_window = {}
previous_rssi = {}
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

#main
display.show(Image.SQUARE_SMALL)

np.fill((30,30,0))
np.show()

while True:
    if button_a.was_pressed():

        rssi_window = {} #clear

        display.show(Image.TARGET) #start scanning
        np.fill((30,0,30))
        np.show()

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
            np.fill((0,50,0))
            np.show()

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

            np.fill((50,0,0))
            np.show()

            # in case no device is detected
            uart.write(
                DEVICE_ID + ",NONE,-999\n"
            )

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
                
    sleep(200)