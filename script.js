"use strict";
// active hack by pressing the 'Delete' button ot by type 'intHacking()' in the console
//todo
//* set up filter √
//* set up sort √
//* mix the 2 together √
//* search funtion √
//* Details-popup √
//* Prefects √
//* Inquisitorial Squad √
//* Expelling students √
//* Add yourself √
//* Hacking √

window.addEventListener("DOMContentLoaded", start);
// activates hacking
document.addEventListener("keyup", (event) => {
  if (event.key == "Delete") {
    intHacking();
  }
});
//* ---------- Make filter List and check search field ----------

// generate filters dynamically (Don't Repeat Yourself)
function generateFilterList() {
  let search = document.querySelector(".filter");
  search.addEventListener("keyup", (e) => {
    displayOrganizedList();
  });
  [
    "Gryffindor",
    "Hufflepuff",
    "Ravenclaw",
    "Slytherin",
    "Pure",
    "Half-Blood",
    "Prefect",
    "Inquisitorial Squad",
  ].forEach((filterName) => {
    let newElement = document.createElement("button");
    newElement.setAttribute("class", "filter");
    newElement.setAttribute("data-action", "filter");
    newElement.setAttribute("data-filter", filterName);
    newElement.setAttribute("data-active", "false");
    newElement.innerText = filterName;
    newElement.addEventListener("click", (e) => {
      // invert selection on click
      if (e.target.getAttribute("data-active") === "false") {
        e.target.setAttribute("data-active", "true");
        // style, just to make things obvious
        e.target.setAttribute("style", "color: green;");
      } else {
        e.target.setAttribute("data-active", "false");
        e.target.setAttribute("style", "");
      }
      // then display the list
      displayOrganizedList();
    });
    document.getElementById("filterContainer").appendChild(newElement);
  });
}
//* ---------- Filter based on Buttons ----------
function displayOrganizedList() {
  // clone the array, so we can mutate it
  let students = [...allStudent];
  console.log("well this works");
  students = searchField(students);
  // iterate through all active filters
  for (const filterElement of document.getElementsByClassName("filter")) {
    if (filterElement.getAttribute("data-active") !== "true") {
      continue;
    }
    let filter = filterElement.getAttribute("data-filter");
    // filtering can be done in-line
    if (filter === "Pure" || filter === "Half-Blood") {
      students = students.filter((student) => student.bloodStatus === filter);
    } else if (
      filter === "Slytherin" ||
      filter === "Hufflepuff" ||
      filter === "Ravenclaw" ||
      filter === "Gryffindor"
    ) {
      students = students.filter((student) => student.house === filter);
    } else if (filter === "Prefect") {
      students = students.filter((student) => student.prefect === true);
    } else if (filter === "Expelled") {
    } else if (filter === "Inquisitorial Squad") {
      students = students.filter((student) => student.insquad === true);
    }
  }

  //students = students.filter(searchField());
  displayList(sortList(students));
}

//* ---------- Search Field ----------

// Search function, filters 3 possible options when the search field is typed in.
function searchField(students) {
  let searchTyped = document.querySelector(".filter").value.toLowerCase();
  //* denne statement virker men kun med
  return students.filter((stud) => {
    if (stud.lastname === undefined) {
    } else {
      return (
        stud.house.toLowerCase().includes(searchTyped) ||
        stud.firstname.toLowerCase().includes(searchTyped) ||
        stud.lastname.toLowerCase().includes(searchTyped)
      );
    }
  });
}

let allStudent = [];
let sortBy = "";
let number;
let hackActive = false;
const modal = document.querySelector("#modal");

//* ---------- Start, Load jSon & control ----------

function start() {
  let sortButtons = document.querySelectorAll('[data-action="sort"]');
  sortButtons.forEach((e) => {
    e.addEventListener("click", selectSort);
  });
  //* Prefects
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
  generateFilterList();
  displayList(allStudent);
}

//* ---------- Clean Up The Data ----------

function cleanUp(students) {
  let splitNames = [];
  students.forEach((element, i) => {
    let removeFirstSpace = element.fullname.trim();
    let removeExtraSpace = removeFirstSpace.replace(/\s+/g, " ").trim();
    let tolowerCase = removeExtraSpace.toLowerCase();
    let spiltHyphen = tolowerCase.split("-").join(" ");
    let nickName = getNickName(spiltHyphen);
    let first =
      spiltHyphen.split(" ")[0].substring(0, 1).toUpperCase() +
      spiltHyphen.split(" ")[0].slice(1);
    let middle = checkMiddle(spiltHyphen, nickName);
    let last = checkLast(spiltHyphen);
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
      prefect: false,
      expelled: false,
      insquad: false,
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
function checkMiddle(spiltHyphen, nickName) {
  if (spiltHyphen.split(" ")[2] === undefined || spiltHyphen.split('"')[1]) {
    return "";
  } else {
    let midNames = spiltHyphen.split(" ")[1];
    return midNames.substring(0, 1).toUpperCase() + midNames.slice(1);
  }
}
// puts the last name in the right place & Capitalizes it. As well as checks for hyphenated names
function checkLast(tolowerCase) {
  if (tolowerCase.split(" ")[2] === undefined) {
    let lastNames = tolowerCase.split(" ")[1];
    if (lastNames === undefined) {
      return "undefined";
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

//* ---------- Sorting ----------
function selectSort(event) {
  sortBy = event.target.dataset.sort;
  displayOrganizedList();
}

function sortList(sortedList) {
  //console.log("sortlist function")
  if (sortBy === "firstname") {
    console.log("im here");
    sortedList.sort(sortByfirstName);
  } else if (sortBy === "lastname") {
    sortedList.sort(sortBylastName);
  } else {
    // default: sort by first name
    sortedList.sort(sortByfirstName);
  }

  return sortedList;
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

//* ---------- Prefects ----------
//checks if the student is already a prefect.
function clickedPrefect(listOfAllStudents) {
  document.querySelectorAll(".star").forEach((e, i) => {
    e.addEventListener("click", () => {
      if (listOfAllStudents[i].prefect === true) {
        listOfAllStudents[i].prefect = false;
        displayList(listOfAllStudents);
      } else {
        displayList(checkHouseAndPrepect(listOfAllStudents, i));
      }
    });
  });
}
// check if there is more the 2 prefects the in same house.
function checkHouseAndPrepect(listOfAllStudents, i) {
  const preStud = allStudent.filter((stud) => stud.prefect);
  const other = preStud.filter(
    (stud) => stud.house === listOfAllStudents[i].house
  );
  //console.log(other);
  if (other.length >= 2) {
    //console.log("there can only be two of each house");
    return listOfAllStudents;
  } else {
    listOfAllStudents[i].prefect = true;
    return listOfAllStudents;
  }
}

//* ---------- Inquisitorial Squad ----------

function clickedIS(listOfAllStudents) {
  document.querySelectorAll(".insquad").forEach((e, i) => {
    e.addEventListener("click", () => {
      if (hackActive === true) {
        if (
          listOfAllStudents[i].insquad === false &&
          listOfAllStudents[i].house === "Slytherin" &&
          listOfAllStudents[i].bloodStatus === "Pure"
        ) {
          listOfAllStudents[i].insquad = true;
          displayList(listOfAllStudents);
          setTimeout(() => {
            listOfAllStudents[i].insquad = false;
            displayList(listOfAllStudents);
            alert(
              `${listOfAllStudents[i].firstname} was kicked from the squad`
            );
          }, 2000);
        }
        /* alert("hack active"); */
      } else {
        if (listOfAllStudents[i].insquad === true) {
          listOfAllStudents[i].insquad = false;
          displayList(listOfAllStudents);
        } else {
          displayList(slyAndPure(listOfAllStudents, i));
        }
      }
    });
  });
}
function slyAndPure(listOfAllStudents, i) {
  if (
    listOfAllStudents[i].house === "Slytherin" &&
    listOfAllStudents[i].bloodStatus === "Pure"
  ) {
    listOfAllStudents[i].insquad = true;
    return listOfAllStudents;
  } else {
    return listOfAllStudents;
  }
}

//* ---------- Expell Student ----------

function expelStudent(listOfAllStudents) {
  document.querySelectorAll(".expel").forEach((e, i) => {
    e.addEventListener("click", () => {
      if (listOfAllStudents[i].firstname === "Jonathan") {
        alert("Cant do That");
      } else {
        listOfAllStudents.splice([i], 1);
        displayList(listOfAllStudents);
      }
    });
  });
}

//* ---------- Add Student ----------

function addStudent(listOfAllStudents) {
  let fname = document.getElementById("fname").value;
  let mname = document.getElementById("mname").value;
  let lname = document.getElementById("lname").value;
  let subHouse = document.getElementById("house").value;
  let subBlood = document.getElementById("blood").value;
  let subGender = document.getElementById("gender").value;
  console.log(fname, mname, lname, subHouse, subBlood, subGender);
  if (fname === "") {
    alert("Student most have a Firstname");
  } else {
    listOfAllStudents.unshift({
      firstname:
        fname.substring(0, 1).toUpperCase() + fname.toLowerCase().slice(1),
      middlename:
        mname.substring(0, 1).toUpperCase() + mname.toLowerCase().slice(1),
      lastname:
        lname.substring(0, 1).toUpperCase() + lname.toLowerCase().slice(1),
      gender:
        subGender.substring(0, 1).toUpperCase() +
        subGender.toLowerCase().slice(1),
      house:
        subHouse.substring(0, 1).toUpperCase() +
        subHouse.toLowerCase().slice(1),
      bloodStatus:
        subBlood.substring(0, 1).toUpperCase() +
        subBlood.toLowerCase().slice(1),
      nickname: undefined,
      prefect: false,
      insquad: false,
      expelled: false,
    });
  }
  displayList(listOfAllStudents);
}

//* ---------- Hacking ----------
function intHacking() {
  document.querySelector("body").style.background = "red";
  document.querySelector("h1").textContent = "Student List Was Hacked";
  hackActive = true;
  let elever = [...allStudent];
  let ranBlood = ["Pure", "Half-Blood"];
  console.log(elever);
  elever.forEach((e, i) => {
    if (e.bloodStatus === "Pure") {
      let ranNumber = Math.floor(Math.random() * 2);
      e.bloodStatus = ranBlood[ranNumber];
      console.log((e.bloodStatus = ranBlood[ranNumber]));
    } else {
      e.bloodStatus = "Pure";
    }
  });
  elever.unshift({
    firstname: "Jonathan",
    middlename: "Anthony",
    lastname: "Weldon",
    nickname: undefined,
    bloodStatus: "Pure",
    gender: "Boy",
    house: "Hufflepuff",
    prefect: false,
    expelled: false,
    insquad: false,
  });
  console.log(elever);
  displayList(elever);
}

//* ---------- Display List ----------
function displayList(listOfAllStudents) {
  // clear the list
  document.querySelector("#list tbody").innerHTML = "";
  number = 0;
  // build a new list
  listOfAllStudents.forEach(displayStudents);
  clickedPrefect(listOfAllStudents);
  clickedIS(listOfAllStudents);
  expelStudent(listOfAllStudents);
  document.getElementById("submit").addEventListener("click", () => {
    addStudent(listOfAllStudents);
  });
}

function displayStudents(student) {
  number++;
  // create clone
  const clone = document
    .querySelector("template#studentList")
    .content.cloneNode(true);

  // set clone data
  document.querySelector("h2").textContent = `Number of Students: ${number}`;
  clone.querySelector(
    "[data-field=firstname]"
  ).textContent = `${student.firstname}`;
  clone.querySelector(
    "[data-field=lastname]"
  ).textContent = `${student.lastname}`;
  clone.querySelector("[data-field=desc]").textContent = student.house;

  clone
    .querySelector("[data-field=firstname]")
    .addEventListener("click", () => popupWindow(student));

  // check if prefects
  if (student.prefect === true) {
    clone.querySelector(".star").classList.add("goldenStar");
    console.log(student.prefect);
  } else {
    clone.querySelector(".star").classList.remove("goldenStar");
  }
  // check if Inquisitorial Squad
  if (student.insquad === true) {
    clone.querySelector(".insquad").classList.add("insquadColor");
    console.log(student.insquad);
  } else {
    clone.querySelector(".insquad").classList.remove("insquadColor");
  }

  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}

//* popup widow function
function popupWindow(student) {
  console.log("actor");
  modal.querySelector(
    ".titel2"
  ).textContent = `${student.firstname} ${student.middlename} ${student.lastname} `;
  let url = `images/${student.lastname}_${student.firstname[0]}.png`;
  if (UrlExists(url) === true) {
    modal.querySelector(
      ".studImage"
    ).src = `images/${student.lastname}_${student.firstname[0]}.png`;
  } else if (UrlExists(url) === false) {
    modal.querySelector(
      ".studImage"
    ).src = `images/${student.lastname}_${student.firstname}.png`;
  }
  modal.querySelector(
    "[data-field=gender]"
  ).textContent = `Gender: ${student.gender}`;
  modal.querySelector(
    "[data-field=bloodstat]"
  ).textContent = `Blood Status: ${student.bloodStatus}`;
  modal.querySelector(
    "[data-field=house]"
  ).textContent = `House: ${student.house}`;
  modal.querySelector(
    "[data-field=nickName]"
  ).textContent = `NickName: ${student.nickname}`;
  modal.querySelector(
    "[data-field=prefectStatus]"
  ).textContent = `Prefect Status: ${student.prefect}`;
  modal.querySelector(
    "[data-field=expel]"
  ).textContent = `Expelled Status: ${student.expelled}`;
  modal.querySelector(
    "[data-field=insquad]"
  ).textContent = `Inquisitorial Squad: ${student.insquad}`;
  modal.style.display = "grid";
  document.getElementsByTagName("body")[0].style.overflow = "hidden";
}
// closes the Modal Window
modal.addEventListener("click", () => {
  modal.style.display = "none";
  document.getElementsByTagName("body")[0].style.overflow = "visible";
});

//* check if the image path is real or not
function UrlExists(url) {
  var http = new XMLHttpRequest();
  http.open("HEAD", url, false);
  http.send();
  if (http.status != 404) return true;
  else return false;
}