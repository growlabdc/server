const API = 'https://growlab.space/api'
const sensors = {
  temperature: null,
  humidity: null
}

function setCamera(e, src) {
  document.getElementById('camera').src = src
  Elem.each(document.querySelectorAll('.camera-action'), function(elem) {
    elem.classList.remove('active')
  })
  e.target.classList.add('active')
}

function getSVP(temp) {
  return 610.7 * (Math.pow(10, (7.5 * temp / (237.3 + temp))))
}

function getVPD(temp, hum) {
  const svp = getSVP(temp)
  const vpd = (((100 - hum) / 100) * svp) / 1000
  return {
    svp,
    vpd
  }
}

function updateVPD() {
  if (!sensors.temperature || !sensors.humidity)
    return

  const data = getVPD(sensors.temperature, sensors.humidity)

  document.querySelector('#svp').innerHTML = 'SVP: ' + (data.svp / 1000).toFixed(3)
  document.querySelector('#vpd').innerHTML = 'VPD: ' + data.vpd.toFixed(3)
}

function get_ph_chart(e, period) {
  let period_start
  let interval_length

  if (e) {
    console.log(e)
    Elem.each(e.target.parentNode.childNodes, (e) => {
      e.classList.remove('active')
    })
    e.target.classList.add('active')
  }

  switch(period) {
    case '1w':
      period_start = new Date().setTime(end - (7 * 24*60*60*1000)).toString()
      interval_length = 10
      break

    case '3d':
      period_start = new Date().setTime(end - (3 * 24*60*60*1000)).toString()
      interval_length = 5
      break

    default:
      period_start = start
      interval_length = 1
      break
  }

  App.api('/ph.up').get({
    start: period_start,
    end: end
  }).success((up) => {
    App.api('/ph.down').get({
      start: period_start,
      end: end
    }).success((down) => {

      let markers = []

      up.forEach((d) => {
	markers.push({
	  timestamp: new Date(d.timestamp),
	  label: `${d.value}mL up`
	})
      })

      down.forEach((d) => {
	markers.push({
	  timestamp: new Date(d.timestamp),
	  label: `${d.value}mL down`
	})
      })

      d3.json(`${API}/reservoir.ph?start=${period_start}end=${end}`, function(data) {

	let results = []
	let value = 0

	results.push(data[0])

	for (let i=1;i<data.length;i++) {
	  var d = data[i]

	  value += d.value

	  if (i % interval_length === 0) {
	    results.push({
	      timestamp: d.timestamp,
	      value: parseFloat((value / interval_length).toFixed(1))
	    })

	    value = 0
	  }
	}

	results.forEach(function(d){ d.timestamp = new Date(d.timestamp) });

	MG.data_graphic({
	  data: results,
	  full_width: true,
	  height: 200,
	  area: true,
	  markers: markers,
	  target: document.getElementById('reservoir-ph-chart'),
	  show_tooltips: false,
	  x_accessor: 'timestamp',
	  y_accessor: 'value',
	  y_rug: true,
	  min_y: 4.5
	});
      });

    }).error((err) => {
      console.error(err)
    })
  }).error((err) => {
    console.error(err)
  })
}

var socket = io('https://growlab.space/')

socket.on('bucket.4.temperature', (value) => {
  //TODO: evaluate range
  document.querySelector('#reservoir-temperature').innerHTML = value + '°C'
  App.log('info', 'bucket.4.temperature', value)
})

socket.on('reservoir.ph', (value) => {
  document.querySelector('#reservoir-ph').innerHTML = value
  App.log('info', 'reservoir.ph', value)
})

socket.on('tent.humidity', (value) => {
  document.querySelector('#tent-humidity').innerHTML = value + '%'
  App.log('info', 'tent.humidity', value)
  sensors.humidity = value
  updateVPD()
})

socket.on('tent.temperature', (value) => {
  document.querySelector('#tent-temperature').innerHTML = value + '°C'
  App.log('info', 'tent.temperature', value)
  sensors.temperature = value
  updateVPD()
})

socket.on('reservoir.water_level', (value) => {
  document.querySelector('#reservoir-water-level').innerHTML = value + 'cm'
  App.log('info', 'reservoir.water_level', value)
})

socket.on('tent.infrared_spectrum', (value) => {
  document.querySelector('#tent-infrared-spectrum').innerHTML = 'IR: ' + value
  App.log('info', 'tent.infrared_spectrum', value)
})

socket.on('tent.full_spectrum', (value) => {
  document.querySelector('#tent-full-spectrum').innerHTML = 'Full: ' + value
  App.log('info', 'tent.full_spectrum', value)
})

socket.on('tent.visible_spectrum', (value) => {
  document.querySelector('#tent-visible-spectrum').innerHTML = 'Visible: ' + value
  App.log('info', 'tent.visible_spectrum', value)
})

socket.on('tent.illuminance', (value) => {
  document.querySelector('#tent-illuminance').innerHTML = value + ' Lux'
  App.log('info', 'tent.illuminance', value)
})

socket.on('ac.status', (value) => {
  document.querySelector('#ac-status').innerHTML = App.status(value)
})

socket.on('light.status', (value) => {
  document.querySelector('#light-status').innerHTML = App.status(value)
})

socket.on('exhaust.status', (value) => {
  document.querySelector('#exhaust-status').innerHTML = App.status(value)
})

socket.on('drain_valve.status', (value) => {
  document.querySelector('#drain-valve-status').innerHTML = App.status(value)
})

socket.on('fill_valve.status', (value) => {
  document.querySelector('#fill-valve-status').innerHTML = App.status(value)
})

socket.on('drain_pump.status', (value) => {
  document.querySelector('#drain-pump-status').innerHTML = App.status(value)
})

socket.on('grow_system_pumps.status', (value) => {
  document.querySelector('#grow-system-pumps-status').innerHTML = App.status(value)
})

socket.on('system.state', (value) => {
  document.querySelector('#system-state').innerHTML = value
})

socket.on('system.override', (value) => {
  console.log('System Override:', value)
})

App.api('/info').get().success((data) => {
  var start = new Date(data.started_at)
  var now = new Date()
  var days = (now - start) / (24 * 60 * 60 * 1000)
  var weeks = days / 7

  document.querySelector('#system-state').innerHTML = data.state
  document.querySelector('#grow-stage').innerHTML = data.stage

  var info = 'Week ' + Math.ceil(weeks) + ' - Day ' + Math.round(days) + ' - ' + data.strain
  document.querySelector('#grow-info').innerHTML = info

  document.querySelector('#ac-status').innerHTML = App.status(data.relays.ac)
  document.querySelector('#light-status').innerHTML = App.status(data.relays.light)
  document.querySelector('#exhaust-status').innerHTML = App.status(data.relays.exhaust)
  document.querySelector('#drain-valve-status').innerHTML = App.status(data.relays.drain_valve)
  document.querySelector('#fill-valve-status').innerHTML = App.status(data.relays.fill_valve)
  document.querySelector('#drain-pump-status').innerHTML = App.status(data.relays.drain_pump)
  document.querySelector('#grow-system-pumps-status').innerHTML = App.status(data.relays.grow_system_pumps)

}).error((err) => {
  console.error(err)
})

var end = new Date().getTime()
var start = new Date().setTime(end - (12*60*60*1000))

end = end.toString()
start = start.toString()

d3.json(`${API}/bucket.4.temperature?start=${start}end=${end}`, function(data) {
  data.forEach(function(d){ d.timestamp = new Date(d.timestamp) });
  MG.data_graphic({
    data: data,
    full_width: true,
    height: 200,
    area: true,
    target: document.getElementById('reservoir-temperature-chart'),
    missing_is_hidden: true,
    show_tooltips: false,
    x_accessor: 'timestamp',
    y_accessor: 'value'
  });
});

App.api('/light.status').get({
  start: new Date().setTime(end - (24*60*60*1000)),
  end: end
}).success((data) => {

  let status = data[0].value
  let markers = []  

  data.forEach((d) => {
    if (status !== d.value)
      d.value === 1 ? markers.push({
	timestamp: new Date(d.timestamp),
	label: 'light on'
      }) : markers.push({
	timestamp: new Date(d.timestamp),
	label: 'light off'
      })

    status = d.value
  })

  d3.json(`${API}/tent.temperature?start=${start}end=${end}`, function(data) {
    data.forEach(function(d){ d.timestamp = new Date(d.timestamp) });
    MG.data_graphic({
      data: data,
      full_width: true,
      height: 200,
      area: true,
      target: document.getElementById('tent-temperature-chart'),
      missing_is_hidden: true,
      show_tooltips: false,
      markers: markers,
      x_accessor: 'timestamp',
      y_accessor: 'value',
      y_rug: true,
      max_y: 28,
      min_y: 20
    });
  });

  d3.json(`${API}/tent.humidity?start=${start}end=${end}`, function(data) {
    data.forEach(function(d){ d.timestamp = new Date(d.timestamp) });
    MG.data_graphic({
      data: data,
      full_width: true,
      height: 200,
      area: true,
      target: document.getElementById('tent-humidity-chart'),
      missing_is_hidden: true,
      show_tooltips: false,
      markers: markers,      
      x_accessor: 'timestamp',
      y_accessor: 'value'
    });
  });

  d3.json(`${API}/tent.illuminance?start=${start}end=${end}`, function(data) {
    data.forEach(function(d){ d.timestamp = new Date(d.timestamp) });
    MG.data_graphic({
      data: data,
      full_width: true,
      height: 200,
      area: true,
      target: document.getElementById('tent-illuminance-chart'),
      missing_is_hidden: true,
      show_tooltips: false,
      markers: markers,      
      x_accessor: 'timestamp',
      y_accessor: 'value'
    });
  });
  
}).error((err) => {
  console.error(err)
})  

d3.json(`${API}/reservoir.water_level?start=${start}end=${end}`, function(data) {
  data.forEach(function(d){ d.timestamp = new Date(d.timestamp) });
  MG.data_graphic({
    data: data,
    full_width: true,
    height: 200,
    area: true,
    target: document.getElementById('reservoir-water-level-chart'),
    missing_is_hidden: true,
    show_tooltips: false,
    x_accessor: 'timestamp',
    y_accessor: 'value'
  });
});

get_ph_chart()
