const searchBtn = document.getElementById('search-btn')
const cityInput = document.getElementById('city-input')
const cityName = document.getElementById('city-name')
const weatherDesc = document.getElementById('weather-desc')
const temp = document.getElementById('temp')


//functions//
function setTheme(condition, sunrise, sunset) {
  const bg = document.getElementById('weather-bg')
  const now = new Date().getTime() / 1000
  const isNight = now < sunrise || now > sunset
  document.body.classList.remove('sunny', 'rainy', 'stormy', 'sunny-night', 'rainy-night')

  if (condition === 'Clear') {
    if (isNight) { 
      document.body.classList.add('sunny-night')
      buildNight()
    } else {
      document.body.classList.add('sunny')
      buildSunny()  
    }

} else if (condition === 'Rain' || condition === 'Drizzle' || condition === 'Mist') {
  isNight ? document.body.classList.add('rainy-night') : document.body.classList.add('rainy')
  buildRain()

} else if (condition === 'Thunderstorm') {
  document.body.classList.add('stormy')
  buildRain()
  

} else {
  if (isNight) {
    document.body.classList.add('sunny-night')
    buildNight()
  } else {
    document.body.classList.add('sunny')
    bg.innerHTML = ''
  }
}
  
  /*if (condition === 'Clear'){
    isNight ? document.body.classList.add('sunny-night') : document.body.classList.add('sunny')

  } else if (condition === 'Rain' || condition === 'Drizzle' || condition === 'Mist') {
    isNight ? document.body.classList.add('rainy-night') : document.body.classList.add('rainy')

  } else if (condition === 'Thunderstorm') {
    document.body.classList.add('stormy')

  } else {
    isNight ? document.body.classList.add('sunny-night') : document.body.classList.add('sunny')
  }
*/
}

function getIcon(condition) {
  if (condition === 'Clear')        return '☀️'
  if (condition === 'Clouds')       return '⛅'
  if (condition === 'Rain')         return '🌧️'
  if (condition === 'Drizzle')      return '🌦️'
  if (condition === 'Thunderstorm') return '⛈️'
  if (condition === 'Snow')         return '❄️'
  return '🌫️'
}

function updateTime(timezoneOffset) {
  const utc = new Date().getTime() + new Date().getTimezoneOffset() * 60000
  const localTime = new Date(utc + timezoneOffset * 1000)

  const hours   = localTime.getHours().toString().padStart(2, '0')
  const minutes = localTime.getMinutes().toString().padStart(2, '0')

  document.getElementById('local-time').innerHTML = `${hours}<span class="colon">:</span>${minutes}`
}

function buildSunny() {
  const bg = document.getElementById('weather-bg')
  bg.innerHTML = ''

  // sun
  const sun = document.createElement('div')
  sun.className = 'sun'
  bg.appendChild(sun)

  // clouds
  const cloudData = [
    { top: '15vh', width: 120, duration: 18, delay: 0,  opacity: 0.7 },
    { top: '25vh', width: 90,  duration: 24, delay: 6,  opacity: 0.5 },
    { top: '10vh', width: 150, duration: 30, delay: 12, opacity: 0.6 },
    { top: '35vh', width: 80,  duration: 20, delay: 3,  opacity: 0.4 },
  ]

  cloudData.forEach(function(data) {
    const cloud = document.createElement('div')
    cloud.className = 'cloud'
    cloud.style.top             = data.top
    cloud.style.width           = data.width + 'px'
    cloud.style.height          = Math.round(data.width * 0.4) + 'px'
    cloud.style.animationDuration  = data.duration + 's'
    cloud.style.animationDelay     = data.delay + 's'
    cloud.style.opacity         = data.opacity
    bg.appendChild(cloud)
  })
}

function buildNight() {
  const bg = document.getElementById('weather-bg')
  bg.innerHTML = ''

  const moon = document.createElement('div')
  moon.className = 'moon'
  bg.appendChild(moon)

  for (let i = 0; i < 80; i++) {
    const star = document.createElement('div')
    star.className = 'star'

    const size = Math.random() * 3 + 1
    star.style.width            = size + 'px'
    star.style.height           = size + 'px'
    star.style.top              = Math.random() * 100 + 'vh'
    star.style.left             = Math.random() * 100 + 'vw'
    star.style.animationDuration   = (Math.random() * 3 + 2) + 's'
    star.style.animationDelay      = (Math.random() * 3) + 's'
    star.style.opacity          = Math.random() * 0.7 + 0.3

    bg.appendChild(star)
  }
}

function buildRain() {
  const bg = document.getElementById('weather-bg')
  bg.innerHTML = ''

  for (let i = 0; i < 60; i++) {
    const drop = document.createElement('div')
    drop.className = 'drop'
    drop.style.left               =Math.random() * 100 + 'vw'
    drop.style.animationDuration  =(Math.random() * 0.5 + 0.6) + 's'
    drop.style.animationDelay     =(Math.random() * 2) + 's'
    drop.style.opacity            =Math.random() * 0.4 + 0.2
    drop.style.height             =Math.random() * 15 + 10 + 'px'
    bg.appendChild(drop)
  }
}

async function getWeather(city) {
  const url = `/weather?city=${city}`

  const response = await fetch(url)
  const data = await response.json()
  
  if (data.cod === '404' || data.cod === 404) {
    cityName.textContent    = 'City not found'
    weatherDesc.textContent = 'Try a different city'
    temp.textContent        = '--°C'
    setTheme('Thunderstorm', 0, 0)
    
    return null
  }

  const condition = data.weather[0].main
  const sunrise = data.sys.sunrise
  const sunset = data.sys.sunset

  setTheme(condition, sunrise, sunset)

  return data
}

async function getForecast(city) {
  const url = `/forecast?city=${city}`

  const response = await fetch(url)
  const data = await response.json()

  return data
}

function displayForecast(data) {
  const forecastCards = document.getElementById('forecast-cards')
  forecastCards.innerHTML = ''

  const days = {}

  data.list.forEach(function(item) {
    const date = new Date(item.dt * 1000)
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })

    if (!days[dayName]) {
      days[dayName] = item
    }
  })

  const dayKeys = Object.keys(days).slice(0, 5)

  dayKeys.forEach(function(day, index) {
    const item = days[day]
    const temperature = Math.round(item.main.temp)
    const icon = getIcon(item.weather[0].main)
    const isToday = index === 0

    const card = document.createElement('div')
    card.className = isToday ? 'forecast-card today' : 'forecast-card'
    card.style.animationDelay = `${index * 0.15}s`
    card.innerHTML = `
      <span class="fc-day">${isToday ? 'Today' : day}</span>
      <span class="fc-icon">${icon}</span>
      <span class="fc-temp">${temperature}°C</span>
    `

    forecastCards.appendChild(card)
  })
}

searchBtn.addEventListener('click', async function() {
  const query = cityInput.value.trim()

  if (query === '') return

  const data = await getWeather(query)

  if (!data) return

  cityName.textContent    = data.name +', ' + data.sys.country
  weatherDesc.textContent = data.weather[0].description
  temp.textContent        = Math.round(data.main.temp) + '°C'
  document.getElementById('feels-like').textContent = `Feels like ${Math.round(data.main.feels_like)}°C`

  if (window.timeInterval) clearInterval(window.timeInterval)
  updateTime(data.timezone)
  window.timeInterval = setInterval(function() {
    updateTime(data.timezone)
  }, 1000)

  const forecastData = await getForecast(query)
  displayForecast(forecastData)

  const condition = data.weather[0].main

  /*
  if (condition === 'Clear') {
    setTheme('sunny')
  } else if (condition === 'Rain' || condition === 'Drizzle' || condition === 'Mist') {
    setTheme('rainy')
  } else if (condition === 'Thunderstorm') {
    setTheme('stormy')
  } else {
    setTheme('sunny')
  }
*/
  cityInput.value = ''
})

cityInput.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    searchBtn.click()
  }
})



