const socket = io();

const createServiceCard = (service) => {
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

  return article;
};

socket.on("service:created", (service) => {
  if (!service.available) {
    return;
  }

  const container = document.querySelector("#available-services");

  if (!container) {
    return;
  }

 document.querySelector("#empty-availability")?.remove();
 container.appendChild(createServiceCard(service));


});

socket.on("service:updated", (service) => {
  const container = document.querySelector("#available-services");

  if (!container) {
    return;
  }

  const currentCard = container.querySelector(
    `[data-service-id="${service.id}"]`
  );

  if (!service.available) {
    currentCard?.remove();

    if (!container.querySelector("article")) {
      const emptyMessage = document.createElement("p");
      emptyMessage.id = "empty-availability";
      emptyMessage.textContent = "No hay servicios disponibles.";
      container.appendChild(emptyMessage);
    }

    return;
  }

  document.querySelector("#empty-availability")?.remove();

  const updatedCard = createServiceCard(service);

  if (currentCard) {
    currentCard.replaceWith(updatedCard);
  } else {
    container.appendChild(updatedCard);
  }
});

socket.on("service:deleted", (service) => {
  const container = document.querySelector("#available-services");

  if (!container) {
    return;
  }

  const currentCard = container.querySelector(
    `[data-service-id="${service.id}"]`
  );

  currentCard?.remove();

  if (!container.querySelector("article")) {
    const emptyMessage = document.createElement("p");
    emptyMessage.id = "empty-availability";
    emptyMessage.textContent = "No hay servicios disponibles.";
    container.appendChild(emptyMessage);
  }
});