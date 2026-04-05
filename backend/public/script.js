
const API = window.location.origin;

// Set date
document.getElementById("date").value =
  new Date().toISOString().split("T")[0];

// Submit
async function submitData() {
  const name = document.getElementById("name").value.trim();
  const date = document.getElementById("date").value;
  const count = parseInt(document.getElementById("count").value);

  if (!name || !count || count <= 0) {
    alert("Enter valid details");
    return;
  }

  try {
    await fetch(API + "/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, date, count })
    });


    document.getElementById("count").value = "";

    loadData(name);

  } catch (err) {
    alert("❌ Server error");
  }
}

// Load
async function loadData(name = "") {
  try {

    if (name) {
      const r1 = await fetch(API + "/user/" + name);
      const d1 = await r1.json();
      document.getElementById("individual").innerText = d1.total || 0;
    }

    const r2 = await fetch(API + "/total");
    document.getElementById("total").innerText = (await r2.json()).total || 0;

    const r3 = await fetch(API + "/today");
    document.getElementById("today").innerText = (await r3.json()).total || 0;

    const r4 = await fetch(API + "/users");
    document.getElementById("users").innerText = (await r4.json()).count || 0;

  } catch (e) {
    console.log(e);
  }
}

loadData();
setInterval(loadData, 5000);