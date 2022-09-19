window.addEventListener("DOMContentLoaded", start);

function start() {
  loadJSON();
}
async function loadJSON() {
  const response1 = await fetch("students.json");
  const students = await response1.json();
  const response2 = await fetch("families.json");
  const familes = await response2.json();

  // when loaded, prepare data objects
  prepareObjects(students, familes);
}
function prepareObjects(students, familes) {
  controller(students, familes);
}

function controller(students, familes) {
  let cleanUpNames = cleanUp(students);
  let listWithBloodStat = bloodStat(cleanUpNames, familes);
  console.log(/* cleanUpNames, familes */ listWithBloodStat);
  displayList(listWithBloodStat);
}
// clean up the list. first, middle, last name & capitalize.

function cleanUp(students) {
  let splitNames = [];
  students.forEach((element, i) => {
    let removeFirstSpace = element.fullname.trim();
    let removeExtraSpace = removeFirstSpace.replace(/\s+/g, " ").trim();
    let tolowerCase = removeExtraSpace.toLowerCase();
    let nickName = getNickName(tolowerCase);
    let first =
      tolowerCase.split(" ")[0].substring(0, 1).toUpperCase() +
      tolowerCase.split(" ")[0].slice(1);
    let middle = checkMiddle(tolowerCase, nickName);
    let last = checkLast(tolowerCase);
    let propperHouse = students[i].house.toLowerCase().trim();
    splitNames.push({
      firstname: first,
      middlename: middle,
      lastname: last,
      nickname: nickName,
      gender:
        students[i].gender.substring(0, 1).toUpperCase() +
        students[i].gender.slice(1),
      house: propperHouse.substring(0, 1).toUpperCase() + propperHouse.slice(1),
    });
  });
  //console.log(splitNames);
  return splitNames;
}

function getNickName(tolowerCase) {
  let nicknames = tolowerCase.split('"')[1];
  if (nicknames === undefined) {
    undefined;
  } else {
    //console.log(nicknames)
    return nicknames.substring(0, 1).toUpperCase() + nicknames.slice(1);
  }
}

// puts the middle name in the right place & Capitalizes it
function checkMiddle(tolowerCase, nickName) {
  if (tolowerCase.split(" ")[2] === undefined || tolowerCase.split('"')[1]) {
    return "";
  } else {
    let midNames = tolowerCase.split(" ")[1];
    return midNames.substring(0, 1).toUpperCase() + midNames.slice(1);
  }
}
// puts the last name in the right place & Capitalizes it. As well as checks for hyphenated names
function checkLast(tolowerCase) {
  if (tolowerCase.split(" ")[2] === undefined) {
    let lastNames = tolowerCase.split(" ")[1];
    if (lastNames === undefined) {
      return undefined;
    } else {
      let lastNameCap =
        lastNames.substring(0, 1).toUpperCase() + lastNames.slice(1);
      return lastNameCap.replace(/(^|[\s-])\S/g, function (match) {
        return match.toUpperCase();
      });
    }
  } else {
    let lastNames2 = tolowerCase.split(" ")[2];
    return lastNames2.substring(0, 1).toUpperCase() + lastNames2.slice(1);
  }
}

// Add blood status
function bloodStat(cleanUpNames, familes) {
  // makes to new arrays based on the familes array
  let half = familes.half;
  let pure = familes.pure;
  let studLast = [];
  //make a new array with only lastnames
  cleanUpNames.forEach((e, i) => {
    studLast.push(cleanUpNames[i].lastname);
  });

  // filters the list of students and makes a new list with does who are pure and does who are half
  let filterPure = studLast.filter(function (e) {
    return pure.indexOf(e) > -1;
  });
  let filterHalf = studLast.filter(function (e) {
    return half.indexOf(e) > -1;
  });
  //gets the names which are on both list
  let halfblood = filterPure.filter(function (e) {
    return filterHalf.indexOf(e) > -1;
  });
  // Removes HalfBloods from the list with PureBloodz(yes it's with a 'z')
  filterPure.forEach((o, p) => {
    halfblood.forEach((e1, i1) => {
      if (e1 === o) {
        //console.log(e1);
        filterPure.splice(p, 1);
        //console.log(filterPure);
      }
    });
  });
  // Adds an object value to each name which matches it.
  cleanUpNames.forEach((e, i) => {
    filterPure.forEach((e1) => {
      if (e.lastname === e1) {
        cleanUpNames[i].bloodStatus = "Pure";
      }
    });
    filterHalf.forEach((e1) => {
      if (e.lastname === e1) {
        cleanUpNames[i].bloodStatus = "Half-Blood";
      }
    });
  });
  console.log(/* filterPure, filterHalf, halfblood  cleanUpNames*/);
  return cleanUpNames;
}

// Add images
function images() {
  const path = require.context("./images", false, /\.png$/);
  return path.keys().map(path);
}
console.log(images());

// set up filter

// set up sort

// mix the 2 together

// search funtion

function displayList(listWithBloodStat) {
  // clear the list
  document.querySelector("#list tbody").innerHTML = "";

  // build a new list
  listWithBloodStat.forEach(displayStudents);
  console.log(listWithBloodStat);
}

function displayStudents(student) {
  // create clone
  const clone = document
    .querySelector("template#studentList")
    .content.cloneNode(true);
  // set clone data
  clone.querySelector(
    "[data-field=name]"
  ).textContent = `${student.firstname} ${student.middlename} ${student.lastname}`;
  clone.querySelector("[data-field=desc]").textContent = student.house;
  clone.querySelector("[data-field=type]").textContent = student.type;
  clone.querySelector("[data-field=age]").textContent = student.gender;
  /* clone.querySelector(".studImage").src = `image/${student.lastname.toLowerCase().split('-')[0]}.png`; */

  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}
