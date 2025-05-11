document.addEventListener("DOMContentLoaded", () => {
    const btnOn = document.getElementById("btn-on");
    const btnOff = document.getElementById("btn-off");
  
    function setActiveButton(activeBtn, inactiveBtn) {
      activeBtn.classList.add("active");
      inactiveBtn.classList.remove("active");
    }
  
    btnOn.addEventListener("click", (e) => {
      e.preventDefault();
      setActiveButton(btnOn, btnOff);
      window.location.href = btnOn.getAttribute("href");
    });
  
    btnOff.addEventListener("click", (e) => {
      e.preventDefault();
      setActiveButton(btnOff, btnOn);
      window.location.href = btnOff.getAttribute("href");
    });
  });