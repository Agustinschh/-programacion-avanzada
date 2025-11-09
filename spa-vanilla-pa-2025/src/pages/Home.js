
import getData from '../utils/getData';

const Home = async () => {
  const data = await getData();
  console.log(data);

  

  const launches = data || [];
  
  const view = `
  <div class="Launches">
    ${
      launches.map(launch => `
        <article class="Launch-card">
          <a href="#/${launch.id}">
            ${launch.links?.patch?.small ? `<img src="${launch.links.patch.small}" alt="${launch.name}">` : ''}
            <h2>${launch.name}</h2>
            <p><strong>Fecha:</strong> ${new Date(launch.date_utc).toLocaleDateString()}</p>
            <p><strong>Estado:</strong> ${launch.success ? '✅ Exitoso' : launch.success === false ? '❌ Fallido' : '⏳ Pendiente'}</p>
            <p><strong>Vuelo #${launch.flight_number}</strong></p>
          </a>
        </article>
      `).join('')
    }
  </div>
  `;
  
  return view;
};

export default Home;
