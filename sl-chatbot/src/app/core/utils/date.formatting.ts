/**
 * [Format Date to string]
 * */
export function getTimeFormat (){
  let d = new Date();

  let year;
  let month;
  let day;
  let hour;
  let minutes;
  let seconds;

  year = d.getFullYear();

  let months = ["01","02","03","04","05","06","07","08","09","10","11","12"];

  month = months[d.getMonth()];

  if(d.getDate() <= 9){
    day = "0"+d.getDate();
  }
  else{
    day = d.getDate();
  }

  if(d.getHours() <= 9){
    hour = "0"+d.getHours();
  }
  else{
    hour = d.getHours();
  }

  if(d.getMinutes() <= 9){
    minutes = "0"+d.getMinutes();
  }
  else{
    minutes = d.getMinutes();
  }

  if(d.getSeconds() <= 9){
    seconds = "0"+d.getSeconds();
  }
  else{
    seconds = d.getSeconds();
  }
  return year+"-"+month+"-"+day+" "+hour+":"+minutes+":"+seconds;
}
