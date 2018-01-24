function addGrow (data, parent) {
  const tmpl = document.getElementById('/grow.html').innerHTML
  Elem.create({
    className: 'item',
    html: doT.template(tmpl)(data),
    parent: parent
  })
}

App.api('/grows/upcoming').get().success((grows) => {
  const parent = document.getElementById('upcoming')
  grows.forEach((grow) => {
    addGrow(grow, parent)
    console.log(grow)
  })
}).error((err) => {
  console.error(err)
})
