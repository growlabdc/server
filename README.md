# GrowLab
> An automated hydroponic system

A Washington DC based hydroponic lab using a deep water culture system.
## Table of Contents
- [Electronics](#hardware)
- [Sensors](#sensors)
- [Grow System](#grow-system)
- [Install](#install)

## Electronics
- [Raspberry Pi 3 Model B](http://amzn.to/2uGSOw6)
- [Peristalic Pumps (x8) (PH up & down + nutrients)](http://amzn.to/2vER8b6)
- [Fill Valve](http://amzn.to/2viZXWY)
- [Drain Valve](http://amzn.to/2vF8zbB)
- [1CH Relay - control AC](http://amzn.to/2wIgsKf)
- [Motor Hat - control peristatlic pumps](http://amzn.to/2wIz6Bv)
- [Arduino Hat](http://amzn.to/2wIIc1a)
- [Power Receptacles](http://amzn.to/2ftdR37)
- [4CH Relay - control receptacles](http://amzn.to/2wu4iFa)
- [2CH Relay - control valves](http://amzn.to/2vn2iPa)

## Sensors
- [Light Sensor - TSL2591](http://amzn.to/2vmFgaW)
- [PH Sensor - SEN0161](http://amzn.to/2vFkXIC)
- [Water Temperature Probes - DS18B20](http://amzn.to/2fsdlTj)
- [Ultrasonic - HC-SR04 (for water level)](http://amzn.to/2ft55SY)
- [Humidity & Temperature - DHT22](http://amzn.to/2vmuDFg)

## Grow System
- [Water Chiller](http://amzn.to/2wIyBXY)
- [Water Pump (x2) - draining & water chiller](http://amzn.to/2vFhHN9)
- [Water Pump - top feed distribution](http://amzn.to/2vn8zdI)
- [Water Pump Manifold](http://amzn.to/2ft3RqT)
- [Exhaust](http://amzn.to/2vFy6RX)
- [Air Stone/Diffuser](http://amzn.com/B01CCAGFKE)
- [Air Pump](http://amzn.to/2wIvf7G)
- [Light](http://amzn.to/2wIjGNF)
- [Light Bulbs](http://amzn.to/2hJWYlF)
- [Nutrient Storage for Pumps](http://amzn.com/B01M8N3FJ3)

## Install
enable ip_tables
```
sudo modprobe ip_tables
sudo echo 'ip_tables' >> /etc/modules
```
update /etc/rc.local
```
# Forward port 80 and 443 so the
# web server can run at normal permissions
sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 8080
sudo iptables -t nat -A PREROUTING -p tcp --dport 443 -j REDIRECT --to-port 3000
```
load /etc/rc.local
```
sudo /etc/rc.local
```
generate ssl csr and generate ssl certificate
```
openssl req -nodes -newkey rsa:2048 -keyout private.key -out server.csr
```
install pm2 and setup startup scripts
```
sudo npm install pm2 -g
pm2 startup
```
setup config.js & grow.json, then start index.js
```
git clone https://github.com/mistakia/growlab.git
cd growlab
npm install
cp config.sample.js config.js
cp grow.sample.json grow.json
pm2 start index.js --watch
```
