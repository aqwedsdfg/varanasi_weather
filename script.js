
    const apiKey = '8d1d95649aea4355811122210251201';
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=Varanasi&days=2&aqi=no&alerts=no`;

    fetch(url)
  .then(res => res.json())
  .then(data => {
    const forecastEl = document.getElementById('forecast');
    forecastEl.innerHTML = '';

    const weekdays = ['रविवार','सोमवार','मंगलवार','बुधवार','गुरुवार','शुक्रवार','शनिवार'];
    const months = ['जनवरी','फरवरी','मार्च','अप्रैल','मई','जून','जुलाई','अगस्त','सितंबर','अक्टूबर','नवंबर','दिसंबर'];
    const now = new Date();

    data.forecast.forecastday.forEach(day => {
      const dateObj = new Date(day.date);
      const isToday = dateObj.toDateString() === now.toDateString();

      // Filter only future hours (today's remaining + next days)
      const filteredHours = day.hour.filter(h => {
        const hourTime = new Date(h.time);
        return hourTime > now;
      });

      if (filteredHours.length === 0) return; // Skip days with no upcoming hours

      const isRainExpected = filteredHours.some(h => h.chance_of_rain > 0);

      const dayBlock = document.createElement('div');
      dayBlock.className = `day-block ${isRainExpected ? 'rainy' : ''}`;

      const dateTitle = document.createElement('div');
      dateTitle.className = 'date-title';
      dateTitle.textContent = `${weekdays[dateObj.getDay()]}, ${dateObj.getDate()} ${months[dateObj.getMonth()]} - ${isRainExpected ? '🌧️ वर्षा संभव' : '☀️ वर्षा नहीं'}`;
      dayBlock.appendChild(dateTitle);

      const grid = document.createElement('div');
      grid.className = 'forecast-grid';

      filteredHours.forEach(hourData => {
        const timeObj = new Date(hourData.time);
        const hour = timeObj.getHours();
        const minutes = timeObj.getMinutes().toString().padStart(2, '0');
        const meridian = hour >= 12 ? 'शाम' : 'सुबह';
        const timeFormatted = `${(hour % 12 || 12)}:${minutes} ${meridian}`;

        const icon = `https:${hourData.condition.icon}`;
        const rainChance = hourData.chance_of_rain;

        const card = document.createElement('div');
        card.className = 'hour-card';
        card.innerHTML = `
          <div class="time">${timeFormatted}</div>
          <img class="icon" src="${icon}" alt="icon" />
          <div class="rain">💧 ${rainChance}% वर्षा संभावना</div>
        `;
        grid.appendChild(card);
      });

      dayBlock.appendChild(grid);
      forecastEl.appendChild(dayBlock);
    });
  })
  .catch(err => {
    document.getElementById('forecast').innerHTML = '❌ डेटा लोड करने में त्रुटि।';
    console.error('API error:', err);
  });
