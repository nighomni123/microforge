// MicroForge Templates — progressive-enhancement filtering + search.
// Works without JS (all cards are in the HTML); JS just narrows the list.
(function () {
  'use strict'
  var year = document.getElementById('year')
  if (year) year.textContent = new Date().getFullYear()

  var grid = document.getElementById('grid')
  var empty = document.getElementById('empty')
  var cards = grid ? Array.prototype.slice.call(grid.querySelectorAll('.card')) : []
  var search = document.getElementById('search')
  var filterBtns = Array.prototype.slice.call(document.querySelectorAll('.filter-btn'))

  var activeFormat = 'all'
  var query = ''

  function normalize(s) {
    return (s || '').toLowerCase().trim()
  }

  function apply() {
    var shown = 0
    cards.forEach(function (card) {
      var fmt = card.getAttribute('data-format')
      var hay = normalize(card.getAttribute('data-text') + ' ' + (card.querySelector('h3') || {}).textContent)
      var okFormat = activeFormat === 'all' || fmt === activeFormat
      var okQuery = !query || hay.indexOf(query) !== -1
      var visible = okFormat && okQuery
      card.style.display = visible ? '' : 'none'
      if (visible) shown++
    })
    if (empty) empty.style.display = shown === 0 ? 'block' : 'none'
  }

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active') })
      btn.classList.add('active')
      activeFormat = btn.getAttribute('data-filter') || 'all'
      apply()
    })
  })

  if (search) {
    search.addEventListener('input', function () {
      query = normalize(search.value)
      apply()
    })
  }

  apply()
})()
