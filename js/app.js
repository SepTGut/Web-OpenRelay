function log(msg) {
  const box = document.getElementById("logBox");
  if (box) {
    box.textContent += msg + "\n";
  }
  console.log(msg);
}

function toggleRelay(id) {
  log("Toggling Relay " + id);

  // simulate API call
  setTimeout(() => {
    log("Relay " + id + " switched");
  }, 500);
}

function testAPI() {
  alert("API OK (dummy)");
}

function saveSettings() {
  const name = document.getElementById("deviceName").value;
  const mqtt = document.getElementById("mqtt").value;

  localStorage.setItem("deviceName", name);
  localStorage.setItem("mqtt", mqtt);

  alert("Saved!");
}