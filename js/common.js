
function setupPoints(numberformat, wrongFormat) {
  decpoint = numberformat.substring((numberformat.substring(1, 2).match(/\.|\,/) ? 5 : 4), (numberformat.substring(1, 2).match(/\.|\,/) ? 6 : 5));
  if (numberformat.substring(1, 2).match(/\.|\,/)) {
    thpoint = numberformat.substring(1, 2); 
  }
  else {
    thpoint = null;
  }
  wrongNumberFormat = wrongFormat + " ( " + numberformat + " ) ";  
}

function setupDateFormat(setDateFormat, setWrongDateFormat) {
  dateFormat = setDateFormat;
  wrongDateFormat = setWrongDateFormat + " ( " + setDateFormat + " ) ";
  formatArray = new Array();
  if(dateFormat.match(/^\w\w\W/)) {
    seperator = dateFormat.substring(2,3);
  }
  else {
    seperator = dateFormat.substring(4,5);
  }
}

function centerParms(width,height,extra) {
  xPos = (screen.width - width) / 2;
  yPos = (screen.height - height) / 2;

  string = "left=" + xPos + ",top=" + yPos;

  if (extra)
    string += "width=" + width + ",height=" + height;

  return string;
}

function escape_more(s) {
  s = escape(s);
  return s.replace(/\+/g, '%2b');
}

function set_longdescription_window(input_name) {
  var parm = centerParms(600,500) + ",width=600,height=500,status=yes,scrollbars=yes";
  var name = document.getElementsByName(input_name)[0].value;
  url = "common.pl?" +
    "action=set_longdescription&" +
    "login=" +  encodeURIComponent(document.getElementsByName("login")[0].value)+ "&"+
    "password=" + encodeURIComponent(document.getElementsByName("password")[0].value) + "&" +
    "longdescription=" + escape_more(document.getElementsByName(input_name)[0].value) + "&" +
    "input_name=" + escape_more(input_name) + "&"
  window.open(url, "_new_generic", parm);
  }

function check_right_number_format(input_name) {
//   if(thpoint) {
//     if(thpoint == ','){
//       var thnumbers = input_name.value.split(',');  
//       thnumbers[thnumbers.length-1] = thnumbers[thnumbers.length-1].substring((thnumbers[thnumbers.length-1].lastIndexOf(".") !== -1 ? thnumbers[thnumbers.length-1].lastIndexOf(".") : thnumbers[thnumbers.length-1].length), 0);
//     }
//     else{
//       var thnumbers = input_name.value.split('.');  
//       thnumbers[thnumbers.length-1] = thnumbers[thnumbers.length-1].substring((thnumbers[thnumbers.length-1].lastIndexOf(",") !== -1 ? thnumbers[thnumbers.length-1].lastIndexOf(",") : thnumbers[thnumbers.length-1].length), 0);
//     }
//         
//     for(var i = 0; i < thnumbers.length; i++) {
//      if(i == 0 && thnumbers[i].length > 3) {
//       return show_alert_and_focus(input_name, wrongNumberFormat);
//      }
//      if(i > 0 && thnumbers[i].length != 3) {
//        return show_alert_and_focus(input_name, wrongNumberFormat);
//      }
//    }
//   }
  if(decpoint == thpoint) {
    return show_alert_and_focus(input_name, wrongNumberFormat);
  }
  if(decpoint == ',') {
    var decnumbers = input_name.value.split(',');
  }
  else {
    var decnumbers = input_name.value.split('.');
  }
  if(decnumbers.length == 2) {
    if(decnumbers[1].length > 2)  {
      return show_alert_and_focus(input_name, wrongNumberFormat);
    }
  }
  else {
    if(decnumbers.length > 2) {
      return show_alert_and_focus(input_name, wrongNumberFormat);
    }
    if(!thpoint) {
      if(decnumbers[0].match(/\D/)) {
        return show_alert_and_focus(input_name, wrongNumberFormat);
      }
    }
  }
}

function check_right_date_format(input_name) {
  if(input_name.value == "") {
    return true;
  }
  var matching = new RegExp(dateFormat.replace(/\w/g, '\\d') + "\$","ig");
  if(!(dateFormat.lastIndexOf("y") == 3) && !matching.test(input_name.value)) {
    matching = new RegExp(dateFormat.replace(/\w/g, '\\d') + '\\d\\d\$', "ig");
    if(!matching.test(input_name.value)) {
      return show_alert_and_focus(input_name, wrongDateFormat);
    }
  }
  else {
    if (dateFormat.lastIndexOf("y") == 3 && !matching.test(input_name.value)) { 
      return show_alert_and_focus(input_name, wrongDateFormat);
    }
  }
}

function validate_dates(input_name_1, input_name_2) {
  var tempArray1 = new Array();
  var tempArray2 = new Array();
  tempArray1 = getDateArray(input_name_1);
  tempArray2 = getDateArray(input_name_2);
  if(check_right_date_format(input_name_1) && check_right_date_format(input_name_2)) {
    if(!((new Date(tempArray2[0], tempArray2[1], tempArray2[2])).getTime() >= (new Date(tempArray1[0], tempArray1[1], tempArray1[2])).getTime())) {
      show_alert_and_focus(input_name_1, wrongDateFormat);
      return show_alert_and_focus(input_name_2, wrongDateFormat);
    }
    if(!((new Date(tempArray2[0], tempArray2[1], tempArray2[2])).getTime() >= (new Date(1900, 1, 1)).getTime())) {
      show_alert_and_focus(input_name_1, wrongDateFormat);
      return show_alert_and_focus(input_name_2, wrongDateFormat);
    }
  }
}

function getDateArray(input_name) {
  formatArray[2] = input_name.value.substring(dateFormat.indexOf("d"), 2);
  formatArray[1] = input_name.value.substring(dateFormat.indexOf("m"), 2);
  formatArray[0] = input_name.value.substring(dateFormat.indexOf("y"), (dateFormat.length == 10 ? 4 : 2));
  if(dateFormat.length == 8) {
    formatArray[0] += (formatArray[0] < 70 ? 2000 : 1900);
  }
  return formatArray;
}

function show_alert_and_focus(input_name, errorMessage) {
  input_name.select();
  alert(errorMessage + "\n\r\n\r--> " + input_name.value);
  input_name.focus();
  return false;
}
  
