var Dat = require('dat-js')

var dat = Dat()
var archive_key = '59298c0c2fcb9c5897d50a2ac2a762789e45d8d77784ac46535340e5a763edc8'
console.log(archive_key)
dat.add(archive_key, function (repo) {

  console.log(repo)
  
  repo.archive.readFile('last_ip.txt', function(err, data) {
    if (err)
      console.log(err)

    console.log(data.toString())
  })
})
