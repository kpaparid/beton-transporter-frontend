export async function loadToursData() {


  

  res = await window.fetch('http://127.0.0.1:8887/tours-labels.json');
  if (!res.ok) {
    throw new Error('API failed');
  }
  else {
    console.log("success")
  }
  const labels = await res.json();
  var res = await window.fetch('http://127.0.0.1:8887/tours.json');
  if (!res.ok) {
    throw new Error('API failed');
  }
  else {
    console.log("success")
  }
  const table = await res.json();

  return { table: table, labels: labels };
}