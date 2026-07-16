from calliopemini import *
import radio
import urandom
import gc

#init radio
radio.on()  
radio.config(group=10, power=6)

DEVICE = "A"

seq = 0

#blink function to indicate transmission
def blink():
    display.show(Image.DIAMOND)
    sleep(50)
    display.clear()
    sleep(50)


display.show(DEVICE)

sleep(urandom.randint(0, 3000))


# packet:
# byte 0 = device ID
# byte 1 = sequence number
packet = bytearray([ord(DEVICE), 0])

while True:

    #collision avoidance
    sleep(urandom.randint(50, 300))

    # Update sequence
    packet[1] = seq

    # Send
    radio.send_bytes(packet)

    # Blink LED when sending
    blink()

    # Increase sequence
    seq += 1

    if seq > 255:
        seq = 0

    # Show ID during transmission
    display.show(DEVICE)

    gc.collect()