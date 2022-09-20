"use strict";

//todo
//* set up filter
//* set up sort
//* mix the 2 together
//* search funtion
//* Details-popup
//* Prefects
//* Expelling students
//* Hacking

window.addEventListener("DOMContentLoaded", start);

let allStudent = []

function start() {

  let filterButtons = document.querySelectorAll('[data-action="filter"]');
  let sortButtons = document.querySelectorAll('[data-action="sort"]');
  sortButtons.forEach((e) => {
    e.addEventListener("click", selectSort);
  });
  filterButtons.forEach((e) => {
    e.addEventListener("click", selectFilter);
  });

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
  allStudent = bloodStat(cleanUpNames, familes);
  console.log(/* cleanUpNames, familes */ allStudent);
  displayList(allStudent);
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

// set up sort
function selectSort(event) {
  let sortButton = event.target.dataset.sort;
  sortList(sortButton);
}

function sortList(sortBy) {
  let sortedList = allStudent;
  console.log(sortBy);
  if (sortBy === "firstname") {
    console.log("im here");
    sortedList.sort(sortByfirstName);
  } else if (sortBy === "house") {
    sortedList.sort(sortByType);
    console.log("type");
  } else if (sortBy === "lastname") {
    sortedList.sort(sortBylastName);
  }
  /* console.log("im over here" + sortedList); */

  displayList(sortedList);
}

function sortByfirstName(studentA, studentB) {
  if (studentA.firstname < studentB.firstname) {
    return -1;
  } else {
    return 1;
  }
}
function sortBylastName(studentA, studentB) {
  if (studentA.lastname < studentB.lastname) {
    return -1;
  } else {
    return 1;
  }
}
function sortByType(studentA, studentB) {
  if (studentA.house < studentB.house) {
    return -1;
  } else {
    return 1;
  }
}



// set up filter
function selectFilter(event) {
  let filterButton = event.target.dataset.filter;
  console.log(filterButton);
  if (filterButton === "*") {
    return displayList(allStudent);
  } else if (filterButton === "Pure" || filterButton === "Half-Blood") {
    displayList(filterListBlood(filterButton));
  } else if (filterButton === "Slytherin" || filterButton === "Hufflepuff" || filterButton === "Ravenclaw" || filterButton === "Gryffindor"){
    displayList(filterListHouse(filterButton));
  }
}
function filterListBlood(filterButton) {
  let filteredList = allStudent;
  console.log(filteredList);
  return (filteredList = allStudent.filter(
    (student) => student.bloodStatus === filterButton
  ));
}
function filterListHouse(filterButton) {
  let filteredList = allStudent;
  console.log(filteredList);
  return (filteredList = allStudent.filter(
    (student) => student.house === filterButton
  ));
  /*   displayList(filteredList); */
}

// mix the 2 together

// search funtion

function displayList(listOfAllStudents) {
  // clear the list
  document.querySelector("#list tbody").innerHTML = "";

  // build a new list
  listOfAllStudents.forEach(displayStudents);
  //console.log(listOfAllStudents);
}

function displayStudents(student) {
  // create clone
  const clone = document
    .querySelector("template#studentList")
    .content.cloneNode(true);
  // set clone data
  clone.querySelector(
    "[data-field=firstname]"
  ).textContent = `${student.firstname}`;
  clone.querySelector(
    "[data-field=lastname]"
  ).textContent = `${student.middlename} ${student.lastname}`;
  clone.querySelector("[data-field=desc]").textContent = student.house;
  /*   clone.querySelector("[data-field=type]").textContent = student.type; */
  clone.querySelector("[data-field=age]").textContent = student.gender;
  if (student.firstname == "Padma") {
    clone.querySelector(
      ".studImage"
    ).src = `images/${student.lastname.toLowerCase()}_${student.firstname.toLowerCase()}.png`;
  } else if (student.firstname == "Parvati") {
    clone.querySelector(
      ".studImage"
    ).src = `images/${student.lastname.toLowerCase()}_${student.firstname.toLowerCase()}.png`;
  } else if (student.lastname == undefined) {
  } else if (student.lastname == "Finch-Fletchley") {
    clone.querySelector(".studImage").src = `images/${student.lastname
      .slice(6)
      .toLowerCase()}_${student.firstname[0].toLowerCase()}.png`;
  } else {
    clone.querySelector(
      ".studImage"
    ).src = `images/${student.lastname.toLowerCase()}_${student.firstname[0].toLowerCase()}.png`;
  }

  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}
