const API = "http://localhost:5000";
document.getElementById("date").value =
  new Date().toISOString().split("T")[0];

// Submit Data
async function submitData() {
  const name = document.getElementById("name").value.trim();
  const date = document.getElementById("date").value;
  const count = document.getElementById("count").value;

  if (!name || !count || count <= 0) {
    alert("Please enter valid details");
    return;
  }

  try {
    const res = await fetch(API + "/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, date, count })
    });

    const data = await res.json();
    document.getElementById("count").value = "";
    loadData(name);

  } catch (error) {
    alert("❌ Server Error");
    console.error(error);
  }
}

async function loadData(name = "") {
  try {
    if (name) {
      const res1 = await fetch(API + "/user/" + name);
      const data1 = await res1.json();
      document.getElementById("individual").innerText = data1.total;
    }

    const res2 = await fetch(API + "/total");
    const data2 = await res2.json();
    document.getElementById("total").innerText = data2.total;
    const res3 = await fetch(API + "/today");
    const data3 = await res3.json();
    document.getElementById("today").innerText = data3.total;
    const res4 = await fetch(API + "/users");
    const data4 = await res4.json();
    document.getElementById("users").innerText = data4.count;

  } catch (error) {
    console.error("Error loading data:", error);
  }
}

loadData();
setInterval(() => {
  loadData();
}, 5000);