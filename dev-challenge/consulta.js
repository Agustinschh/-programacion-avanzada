const dataset = require("./dataset.json");

console.log(
  "✈️  Buscando todos los ida-vuelta con total < $800, availability > 7 y diferencia de fecha ≤ 31 días...\n"
);

let encontrado = false;

// Recorremos pares sin duplicar (j empieza en i+1)
for (let i = 0; i < dataset.length; i++) {
  for (let j = i + 1; j < dataset.length; j++) {
    const vuelo1 = dataset[i];
    const vuelo2 = dataset[j];

    const idaVuelta =
      (vuelo1.destination === vuelo2.origin &&
        vuelo1.origin === vuelo2.destination) ||
      (vuelo2.destination === vuelo1.origin &&
        vuelo2.origin === vuelo1.destination);

    if (!idaVuelta) continue;

    const suma = vuelo1.price + vuelo2.price;
    const disponibilidadOk = vuelo1.availability > 7 && vuelo2.availability > 7;
    const fechaOk = Math.abs(new Date(vuelo1.date) - new Date(vuelo2.date)) <= 31 * 24 * 60 * 60 * 1000;

    if (suma < 800 && disponibilidadOk && fechaOk) {
      const fecha1 = new Date(vuelo1.date);
      const fecha2 = new Date(vuelo2.date);
      const ida = fecha1 <= fecha2 ? vuelo1 : vuelo2;
      const vuelta = ida === vuelo1 ? vuelo2 : vuelo1;
      const diffDays = Math.floor(Math.abs(fecha2 - fecha1) / (24 * 60 * 60 * 1000));
      const fechaPartida = new Date(ida.date).toISOString().slice(0, 10);
      encontrado = true;
      console.log(" Combinación encontrada:");
      console.log(
        `${vuelo1.origin} → ${vuelo1.destination} ($${vuelo1.price}) | avail=${vuelo1.availability}`
      );
      console.log(
        `${vuelo2.origin} → ${vuelo2.destination} ($${vuelo2.price}) | avail=${vuelo2.availability}`
      );
      console.log(
        ` Destino ida: ${ida.destination} |  Fecha partida: ${fechaPartida} | Dif días: ${diffDays}`
      );
      console.log(` Total: $${suma}\n`);
    }
  }
}

if (!encontrado) {
  console.log(
    "❌ No se encontraron vuelos ida-vuelta con total < $800, availability > 7 y fecha con diferencia ≤ 31 días."
  );
}
