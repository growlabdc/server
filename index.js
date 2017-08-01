const water_temperature = null
const humidity = null
const PH = null

const air_pump_on = null
const resevoir_pump_on = null
const AC_on = null
const exhaust_on = null
const drain_pump_on = null
const light_on = null

if (ambient_temperature >= 77) {
  // turn AC on
  // turn exhaust off

  if (ambient_temperature > 80) {
    // send notification
  }

} else if (ambient_temperature >= 76) {
  // turn exhaust on
} else {
  // turn AC off
  // turn exhaust off
}

if (water_temperature > 72) {
  // send notification
}


// light schedule
switch(GROW_STAGE) {
  case 'VEGATATIVE':
    // 18-4
    break;

  case 'FLOWERING':
    // 12-12
    break;

  default:
    // error
    break;
}

if (draining || filling) {
  // turn air_pump off
  // turn resevoir pump off
} else if (growing || dosing) {
  // turn air_pump on
  // turn resevoir pump on
}

if (draining) {
  // turn drain pump on
  // turn drain valve on
} else {
  // turn drain pump off
  // turn drain valve off
}

if (filling) {
  // turn water filter valve on
} else {
  // turn water filter valve off
}
