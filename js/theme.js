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
  document.querySelector('meta[name="theme-color"]').setAttribute("content", "#f6f6f6");
  console.log("setting light from user pref")
}


function toggleTheme() {
        const currentTheme = localStorage.getItem("theme");
        if(currentTheme == "dark") {
          document.getElementById("theme-icon").innerHTML = "dark_mode";
          document.body.classList.toggle("dark-theme");
          localStorage.setItem("theme","light");
          document.querySelector('meta[name="theme-color"]').setAttribute("content", "#f4f6fb");
          console.log("setting light")
          gtag('event', 'Theme', {
            'mode': 'light',
          });

        } else {
          document.getElementById("theme-icon").innerHTML = "light_mode";
          document.body.classList.toggle("dark-theme");
          document.querySelector('meta[name="theme-color"]').setAttribute("content", "#28282e");
          localStorage.setItem("theme", "dark");
          console.log("setting dark");
          gtag('event', 'Theme', {
            'mode': 'dark',
          });
        }
        try {
          DISQUS.reset({
            reload: true
          });
        } catch (error) {
          console.log("No disqus embed to reset");
        }
        
}


