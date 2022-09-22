"use strict";

//todo
//* set up filter √
//* set up sort √
//* mix the 2 together √
//* search funtion √
//* Details-popup 
//* Prefects 
//* Add yourself
//* Expelling students
//* Inquisitorial Squad
//* Hacking

window.addEventListener("DOMContentLoaded", start);


// generate filters dynamically (Don't Repeat Yourself)
function generateFilterList() {
  let search = document.querySelector(".filter");
  search.addEventListener("keyup", (e) => {
    displayOrganizedList();
  });
  [
    "Gryffindor", "Hufflepuff", "Ravenclaw", "Slytherin",
    "Pure", "Half-Blood", "Expelled", "Prefect"
  ].forEach(filterName => {
    let newElement = document.createElement("button");
    newElement.setAttribute("class", "filter");
    newElement.setAttribute("data-action", "filter");
    newElement.setAttribute("data-filter", filterName);
    newElement.setAttribute("data-active", "false");
    newElement.innerText = filterName;
    newElement.addEventListener("click", e => {
      // invert selection on click
      if (e.target.getAttribute("data-active") === "false") {
        e.target.setAttribute("data-active", "true");
        // style, just to make things obvious
        e.target.setAttribute("style", "color: green;")
      }
      else {
        e.target.setAttribute("data-active", "false")
        e.target.setAttribute("style", "");
      }
      // then display the list
      displayOrganizedList();
    })
    document.getElementById("filterContainer").appendChild(newElement);
  });

}
/* let search = document.querySelector(".searchField");
search.addEventListener('input', () => {
}) */

function displayOrganizedList() {
  // clone the array, so we can mutate it
  let students = [...allStudent];
    console.log('well this works')
    students = searchField(students)
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
      students = students.filter((student) => student.prefect === true)
    } else if(filter === "Expelled") {

    }
  }

  //students = students.filter(searchField());
  displayList(sortList(students));
}

// Search function, filters 3 possible options when the search field is typed in.
function searchField(students) {
  let searchTyped = document.querySelector(".filter").value.toLowerCase()
//* denne statement virker men kun med 
return students.filter((stud) => {
  if(stud.lastname === undefined) {
  } else {
  return (
    stud.house.toLowerCase().includes(searchTyped) ||
    stud.firstname.toLowerCase().includes(searchTyped) ||
    stud.lastname.toLowerCase().includes(searchTyped)
  );
}})

}


let allStudent = [];
let sortBy = "";
let number

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
  generateFilterList()
  displayList(allStudent);
  
}

//* ---------- Clean Up The Data ----------

function cleanUp(students) {
  let splitNames = [];
  students.forEach((element, i) => {
    let removeFirstSpace = element.fullname.trim();
    let removeExtraSpace = removeFirstSpace.replace(/\s+/g, " ").trim();
    let tolowerCase = removeExtraSpace.toLowerCase();
    let spiltHyphen = tolowerCase.split('-').join(' ')
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
      insquad: false
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

//* ---------- Sorting ----------
function selectSort(event) {
  sortBy = event.target.dataset.sort;
  displayOrganizedList()
}

 function sortList(sortedList) {
  //console.log("sortlist function")
  if (sortBy === "firstname") {
    console.log("im here");
    sortedList.sort(sortByfirstName);
  }  else if (sortBy === "lastname") {
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
    if(listOfAllStudents[i].prefect === true) {
      listOfAllStudents[i].prefect = false
      displayList(listOfAllStudents)
    } else{
     displayList(checkHouseAndPrepect(listOfAllStudents, i))
    }
  })
})
}
// check if there is more the 2 prefects the in same house.
function checkHouseAndPrepect(listOfAllStudents, i){
  
    const preStud = allStudent.filter((stud) => stud.prefect);
    const other = preStud.filter(
      (stud) => stud.house === listOfAllStudents[i].house
    );
    console.log(other);
    if (other.length >= 2) {
      console.log("there can only be two of each house");
      return listOfAllStudents;
    } else {
      listOfAllStudents[i].prefect = true;
      return listOfAllStudents;
    }
} 













//* ---------- Display List ----------
function displayList(listOfAllStudents) {
  // clear the list
  document.querySelector("#list tbody").innerHTML = "";
  number = 0
  // build a new list
  listOfAllStudents.forEach(displayStudents);
  clickedPrefect(listOfAllStudents);
  //prefects(listOfAllStudents);
  //console.log(listOfAllStudents);
}


function displayStudents(student) {
  number++
  // create clone
  const clone = document
    .querySelector("template#studentList")
    .content.cloneNode(true);

  // set clone data
  document.querySelector('h2').textContent = `Number of Students ${number}`
  clone.querySelector(
    "[data-field=firstname]"
  ).textContent = `${student.firstname}`;
  clone.querySelector(
    "[data-field=lastname]"
  ).textContent = `${student.middlename} ${student.lastname}`;
  clone.querySelector("[data-field=desc]").textContent = student.house;
  clone.querySelector("[data-field=age]").textContent = student.gender;
  let url = `images/${student.lastname}_${student.firstname[0]}.png`;
  if (UrlExists(url) === true) {
    clone.querySelector(
      ".studImage"
    ).src = `images/${student.lastname}_${student.firstname[0]}.png`;
  } else if (UrlExists(url) === false) {
    clone.querySelector(
      ".studImage"
    ).src = `images/${student.lastname}_${student.firstname}.png`;
  }

  // check if prefects

  if (student.prefect === true) {
    clone.querySelector(".star").classList.add('goldenStar');
    console.log(student.prefect)
  } else {
    clone.querySelector(".star").classList.remove("goldenStar");
  }

  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
} 

//* check if the image path is real or not
function UrlExists(url) {
  var http = new XMLHttpRequest();
  http.open("HEAD", url, false);
  http.send();
  if (http.status != 404) return true;
  else return false;
}

