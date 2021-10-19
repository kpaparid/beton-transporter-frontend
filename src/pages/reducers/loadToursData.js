const tourTableUrl = "http://127.0.0.1:8887/tours.json";
const workHoursTableUrl = "http://127.0.0.1:8887/workhours.json";

export async function loadTableData(tableName) {
  switch (tableName) {
    case "toursTable":
      return loadUrls(tourTableUrl);
    case "workHoursTable":
      return loadUrls(workHoursTableUrl);
    default:
      break;
  }
}

async function loadUrls(url) {
  const res = await window.fetch(url);
  const table = await res.json();
  if (!res.ok) {
    throw new Error("API failed");
  } else {
    console.log("loaded TableData ");
  }

  return table;
}
