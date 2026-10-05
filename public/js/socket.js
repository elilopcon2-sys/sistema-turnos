const socket = io();

socket.on("service:created", (service) => {
  if (!service.available) {
    return;
  }

  const container = document.querySelector("#available-services");

  if (!container) {
    return;
  }

  document.querySelector("#empty-availability")?.remove();

  const article = document.createElement("article");
  article.dataset.serviceId = service.id;

  article.innerHTML = `
    <h2>${service.name}</h2>
    <p>${service.description}</p>
    <p>Duración: ${service.duration} minutos</p>
    <p>Precio: $${service.price}</p>
    <p>Categoría: ${service.category}</p>
    <p>Disponible: Sí</p>
  `;

  container.appendChild(article);
});