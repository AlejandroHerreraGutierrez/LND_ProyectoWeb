// we select all the cards
const cards = document.querySelectorAll('#cards div');

cards.forEach(card => {
    //we select the video inside the card
  const video = card.querySelector('video');
  
  //when the mouse enters, the video is played
  card.addEventListener('mouseenter', () => video.play());
  
  //when the mouse enters, the video is stopped
  card.addEventListener('mouseleave', () => {
    video.pause();
    video.currentTime = 0;
  });
});