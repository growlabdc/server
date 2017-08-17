const path = require('path')

module.exports = {
  level_db_path: '/tmp/level_db_data',
  grow_info_path: path.resolve('./grow.sample.json'),
  state_path: path.resolve('./state.json'),
  alerts_log_path: path.resolve('./alerts.log'),
  token: 'password',
  port: 8080,
  ssl_port: 3000,

  notification: {
    device_tokens: [],
    apn: {
      production: false,
      cert: path.join(__dirname, 'apn_cert.pem'),
      key: path.join(__dirname, 'apn_key.pem')
    }
  },

  light_program: false,
  lights: {
    SEEDLING: {
      start: 10,
      end: 16
    },
    VEGATATIVE: {
      start: 10,
      end: 16
    },
    FLOWERING: {
      start: 7,
      end: 19
    }
  },

  sensors: {
    ph: {
      min: 0,
      max: 14
    },
    water_temperature: {
      min: 0,
      max: 32
    },
    air_temperature: {
      min: 0,
      max: 37
    },
    water_level: {
      min: 0,
      max: 38
    },
    illuminance: {
      min: 0,
      max: 88000
    }
  }

  automate_water_level: false,
  maximum_water_level: 10,
  minimum_water_level: 24,
  drain_cycle_level: 21,
  grow_water_level: 12

  automate: false,
  alerts: {
    ph: {
      minimum: 5.5,
      maximum: 7.5
    },
    water_temperature: {
      minimum: 20,
      maximum: 25.5
    },
    humidity: {
      minimum: 30,
      maximum: 90
    },
    air_temperature: {
      minimum: 21.1,
      maximum: 26.1
    },
    water_level: {
      minimum: 8,
      maximum: 25
    },
    illuminance: {
      minimum: -1,
      maximum: 60000
    }
  },

  cameras: [{
    path: '/camera/visible-one/',
    host: 'http://192.1.168.100:8081'
  }],

  motor_hat_one: {
    hat_config: {
      dcs: ['M1','M2','M3','M4']
    },
    motor_config: [{
      speed: 78
    }, {
      speed: 78
    }, {
      speed: 78
    }, {
      speed: 78
    }]
  },
  motor_hat_two: {
    hat_config: {
      dcs: ['M1','M2','M3','M4']
    },
    motor_config: [{
      speed: 78
    }, {
      speed: 78
    }, {
      speed: 78
    }, {
      speed: 78
    }]
  }
}
