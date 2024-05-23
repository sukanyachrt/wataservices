import moment from 'moment'

export function formatDate(dateString) {
  return moment(dateString).format('DD/MM/YYYY HH:mm')
}
export function formatDate_notime(dateString) {
  return moment(dateString).format('DD/MM/YYYY')
}

export function formatDate_thai(dateString) {
  const inputDate = new Date(dateString)
  const options = { day: 'numeric', month: 'short', year: 'numeric' }

  const formattedDate = inputDate.toLocaleDateString('th-TH', options)
  const [day, month, year] = formattedDate.split(' ')


  const christianYear = inputDate.toLocaleDateString('en-US', { year: 'numeric' })

  return `${day}-${month}-${christianYear}`
}

export function convertDateThaitoDatenormal(dateString) {

let thaiMonths = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
let englishMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

for (let i = 0; i < thaiMonths.length; i++) {
    dateString = dateString.replace(thaiMonths[i], englishMonths[i]);
}

let dateObject = new Date(dateString);
let year = dateObject.getFullYear();
let month = dateObject.getMonth() + 1;
let day = dateObject.getDate();
let formattedMonth = month < 10 ? "0" + month : month;
let formattedDay = day < 10 ? "0" + day : day;
let formattedDate = `${year}-${formattedMonth}-${formattedDay}`;
return formattedDate;
}

