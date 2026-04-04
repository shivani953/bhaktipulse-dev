const today = new Date().toISOString().split("T")[0];
document.getElementById("date").value = today;

// Submit
function submitData() {
  let name = document.getElementById("name").value;
  let count = document.getElementById("count").value;

  if (!name || !count) {
    alert("Fill all fields");
    return;
  }

  fetch("/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: name,
      date: today,
      count: count
    })
  })
  .then(res => res.json())
  .then(() => {

    loadIndividual(name);

    document.getElementById("name").value = "";
    document.getElementById("count").value = "";
  });
}

// Load individual count
function loadIndividual(name) {
  fetch("/user/" + name)
    .then(res => res.json())
    .then(data => {
      document.getElementById("individual").innerText = data.total;
    });
}