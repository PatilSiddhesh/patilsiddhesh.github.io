const currentTheme = localStorage.getItem("theme");
if (currentTheme == null) {
  localStorage.setItem("theme","dark");
  document.body.classList.toggle("dark-theme");
  document.getElementById("theme-icon").innerHTML = "light_mode"
  document.querySelector('meta[name="theme-color"]').setAttribute("content", "#28282e");
}
if (currentTheme == "dark") {
  document.body.classList.toggle("dark-theme");
  document.getElementById("theme-icon").innerHTML = "light_mode"
  document.querySelector('meta[name="theme-color"]').setAttribute("content", "#28282e");
  console.log("setting dark from user pref")
} else if (currentTheme == "light") {
  document.body.classList.toggle("light-theme");
  document.getElementById("theme-icon").innerHTML = "dark_mode"
  document.querySelector('meta[name="theme-color"]').setAttribute("content", "#f6f8fc");
  console.log("setting light from user pref")
}


function toggleTheme() {
        const currentTheme = localStorage.getItem("theme");
        if(currentTheme == "dark") {
          document.getElementById("theme-icon").innerHTML = "dark_mode";
          document.body.classList.toggle("dark-theme");
          localStorage.setItem("theme","light");
          document.querySelector('meta[name="theme-color"]').setAttribute("content", "#f6f8fc");
          console.log("setting light")
          ga('send', 'event', 'Theme', "light");

        } else {
          document.getElementById("theme-icon").innerHTML = "light_mode";
          document.body.classList.toggle("dark-theme");
          document.querySelector('meta[name="theme-color"]').setAttribute("content", "#28282e");
          localStorage.setItem("theme", "dark");
          console.log("setting dark");
          ga('send', 'event', 'Theme', "dark");

        }
        try {
          DISQUS.reset({
            reload: true
          });
        } catch (error) {
          console.log("No disqus embed to reset");
        }
        
}


