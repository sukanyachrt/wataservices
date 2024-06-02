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
export function compareDates(starting_date, finishing_date) {
  const today = new Date()
  const starting = new Date(starting_date)
  if (today > starting) {
    const finishing = new Date(finishing_date);
    if (today > finishing) {

      return { 'status': "สิ้นสุดโครงการแล้ว", 'color': "error" }
    }
    else {
      const diffTimefisshing = today - finishing
      const diffDaysfishing = Math.ceil(diffTimefisshing / (1000 * 60 * 60 * 24)) - 1;
      if (diffDaysfishing > 0) {
        return { 'status': `สิ้นสุดโครงการแล้ว`, 'color': "success" }
      }
      else {
        return { 'status': `นับถอยหลัง ${Math.abs(diffDaysfishing)} วัน`, 'color': "success" }
      }
    }
  }
  else {
    const diffTime = today - starting
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) - 1;
    if (diffDays < 0) {
      return { 'status': `เริ่มโครงการในอีก ${Math.abs(diffDays)} วัน`, 'color': "info" }
    }
    else{
      return { 'status': `-`, 'color': "-" }
    }


  }
}
