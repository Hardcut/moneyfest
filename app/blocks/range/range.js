const sliderEl = document.querySelector(".range__input");
const sliderValue = document.querySelector(".range__value");

sliderEl.addEventListener("input", (event) => {
  const tempSliderValue = Number(event.target.value);

  sliderValue.textContent = tempSliderValue;

  const progress = (tempSliderValue / sliderEl.max) * 100;

  sliderEl.style.background = `linear-gradient(to right, rgba(209, 167, 115, 1) ${progress}%, rgba(209, 167, 115, 0.4) ${progress}%)`;
});
