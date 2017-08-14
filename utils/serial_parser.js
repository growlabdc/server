const sensors = [{
  type: 'ph',
  re: /pH: ([\d.]+)/,
  format: function(re_result) {
    return {
      value: parseFloat(re_result[1]),
      key: 'reservoir.ph'
    }
  }
},{
  type: 'water_temperature',
  re: /Temperature bucket ([1234]): ([\d.]+)/,
  format: function(re_result) {
    const bucket_number = parseInt(re_result[1], 10)
    return {
      key: 'bucket.' + bucket_number + '.temperature',
      value: parseFloat(re_result[2])
    }
  }
},{
  type: 'humidity',
  re: /Humidity: ([\d.]+)/,
  format: function(re_result) {
    return {
      key: 'tent.humidity',
      value: parseFloat(re_result[1])
    }
  }    
},{
  type: 'air_temperature',
  re: /Temperature bucket 5: ([\d.]+)/,
  format: function(re_result) {
    return {
      key: 'tent.temperature',
      value: parseFloat(re_result[1])
    }
  }			  
},{
  type: 'water_level',
  re: /Distance: ([\d]+)/,
  format: function(re_result) {
    return {
      key: 'reservoir.water_level',
      value: parseInt(re_result[1], 10)
    }
  }    
},{
  type: 'ir',
  re: /IR: ([\d]+)/,
  format: function(re_result) {
    return {
      key: 'tent.infrared_spectrum',
      value: parseInt(re_result[1], 10)
    }
  }    
},{
  type: 'full_spectrum',
  re: /Full: ([\d]+)/,
  format: function(re_result) {
    return {
      key: 'tent.full_spectrum',
      value: parseInt(re_result[1], 10)
    }
  }    
},{
  type: 'visible_spectrum',
  re: /Visible: ([\d]+)/,
  format: function(re_result) {
    return {
      key: 'tent.visible_spectrum',
      value: parseInt(re_result[1], 10)
    }
  }    
},{
  type: 'illuminance',
  re: /Lux: ([\d]+)/,
  format: function(re_result) {
    return {
      key: 'tent.illuminance',
      value: parseInt(re_result[1], 10)
    }
  }   
}]

const parser = function(message) {

  let item = {}
  
  for(let i=0; i<sensors.length; i++) {
    const re_result = sensors[i].re.exec(message)    
    
    if (re_result) {
      item.type = sensors[i].type
      item.data = sensors[i].format(re_result)
      item.input = re_result.input
      break;
    }
  }

  return item
}

module.exports = parser
