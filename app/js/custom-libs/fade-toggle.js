const fadeIn = (data) => {
  data.el.style.opacity = 0;
  data.el.style.display = data.display || "block";
  data.el.style.transition = `opacity ${data.timeout}ms`;
  setTimeout(() => {
    data.el.style.opacity = data.opacityIn || 1;
  }, 10);
};
const fadeOut = (data) => {
  data.el.style.opacity = 1;
  data.el.style.transition = `opacity ${data.timeout}ms`;
  data.el.style.opacity = 0;
  setTimeout(() => {
    data.el.style.display = "none";
  }, data.timeout);
};