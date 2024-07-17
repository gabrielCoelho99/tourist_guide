document.addEventListener('DOMContentLoaded', function() {
    // Inicializar mapa
    const map = L.map('mapid').setView([-2.5283, -44.3042], 8);
  
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
  
    // Adicionar marcadores para destinos populares
    const destinations = [
      { name: 'São Luís', coords: [-2.5297, -44.3028] },
      { name: 'Lençóis Maranhenses', coords: [-2.5283, -43.1246] },
      { name: 'Alcântara', coords: [-2.4058, -44.4155] }
    ];
  
    destinations.forEach(dest => {
      L.marker(dest.coords).addTo(map)
        .bindPopup(`<b>${dest.name}</b>`)
        .openPopup();
    });
  
    // Função para buscar destinos
    function fetchDestinations() {
      fetch('/api/destinations')
        .then(response => response.json())
        .then(data => {
          const destinationList = document.getElementById('destinos');
          destinationList.innerHTML = '';
          data.forEach(dest => {
            const destItem = document.createElement('div');
            destItem.innerHTML = `
              <h2>${dest.name}</h2>
              <p>${dest.description}</p>
              <img src="${dest.image_url}" alt="${dest.name}" />
              <button onclick="viewDetails(${dest.id})">Ver Detalhes</button>
              <button onclick="addFavorite(${dest.id})">Adicionar aos Favoritos</button>
            `;
            destinationList.appendChild(destItem);
          });
        });
    }
  
    // Função para visualizar detalhes do destino
    window.viewDetails = function(id) {
      fetch(`/api/destinations/${id}`)
        .then(response => response.json())
        .then(data => {
          const detailSection = document.getElementById('destinos');
          detailSection.innerHTML = `
            <h2>${data.name}</h2>
            <p>${data.description}</p>
            <img src="${data.image_url}" alt="${data.name}" />
            <h3>Atrações:</h3>
            <ul>
              ${data.attractions.map(attr => `
                <li>
                  <h4>${attr.name} (${attr.type})</h4>
                  <p>${attr.description}</p>
                  <p>${attr.tips}</p>
                </li>
              `).join('')}
            </ul>
          `;
        });
    }
  
    // Função para adicionar destino aos favoritos
    window.addFavorite = function(id) {
      const userId = getUserIdFromToken(); // Função para obter o ID do usuário a partir do token
      fetch('/api/favorites/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, destinationId: id })
      })
        .then(response => response.json())
        .then(data => {
          alert(data.message);
        });
    }
  
    // Buscar destinos ao carregar a página
    fetchDestinations();
  });
  