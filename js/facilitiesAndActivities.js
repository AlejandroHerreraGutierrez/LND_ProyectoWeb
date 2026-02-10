const allContainers = document.querySelectorAll('#facilities .card');

allContainers.forEach((container) => {

    const card = container.querySelector('#facilities .photo')

container.addEventListener('mousemove', (e) => {
  const { width, height, left, top } = container.getBoundingClientRect();
  
  // 1. Find mouse position relative to the card center
  const mouseX = e.clientX - left;
  const mouseY = e.clientY - top;
  
  const centerX = width / 2;
  const centerY = height / 2;

  // 2. Calculate rotation (adjust the '20' to make it more/less tilt-y)
  const rotateX = ((mouseY - centerY) / centerY) * -20; 
  const rotateY = ((mouseX - centerX) / centerX) * 20;

  // 3. Apply the transform
  card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
});

// 4. Reset when mouse leaves
container.addEventListener('mouseleave', () => {
  card.style.transform = 'rotateX(0deg) rotateY(0deg)';
});

})

function flip(element) {
    element.classList.toggle('is-flipped');
}

