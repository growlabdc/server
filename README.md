Relays
- light
- exhaust
- resevoir pump / air pump / water chiller pump
- drain pump
- AC (BCM 27)
- drain valve (BCM 17)
- fill valve (BCM 16)

Peristaltic Pumps (DC Motor)
- PH Up
- PH Down
- Nutrient pumps (x6)

Sensors
- DS18B20 (water temperature) (x5)
- DHT22 (air temperature & humidity)
- SEN0161 (PH)
- HC-SR04 (Ultrasonic / water level)
- TSL2591 High Dynamic Range Digital Light Sensor
- ec sensor?
- co2 sensor?

Valves
- drain valve
- fill valve

1 Wire Temperature Probe
- 28-0116213619ee (Bucket 4)
- 28-01162144aeee (Bucket 1)
- 28-011621457bee (Bucket 3)
- 28-0116213778ee (Bucket 2)
- 28-02161e453dee (Bucket 5)

enable ip_tables
```
sudo modprobe ip_tables
sudo echo 'ip_tables' >> /etc/modules
```
update /etc/rc.local
```
# Forward port 80 to 5000 (where our web server is) so the
# web server can run at normal permissions
sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 8080
```
generate ssl csr
```
openssl req -nodes -newkey rsa:2048 -keyout private.key -out server.csr
```