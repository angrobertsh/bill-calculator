import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const getSavedData = () => {
  try {
    const storedData = JSON.parse(localStorage.getItem("BillSplitter"))

    return sanitizeData(storedData) || {}
  } catch (e) {
    console.log("failed to load data")
    return {}
  }  
}

// Schema: 
// {
//   people: [{ name: "John", tip: "18.0" }],
//   tax: { type: "percent", value: "10.5" },
//   items: [{ name: "Egg rolls", price: "100.00", eaters: [0], isShared true }],
// }


const sanitizeData = (storedData) => {
  try {
    const failures = []

    failures.push(validatePeople(storedData.people))
    failures.push(validateTax(storedData.tax))
    failures.push(validateItems(storedData.items, storedData.people))

    if (failures.find(cases => cases === true)) {
      console.log("found a failure", failures)
      return null
    }
    
    return storedData
  } catch (e) {
    return null
  }
}

const validatePeople = (people) => {
  for (let i = 0; i < people.length; i++) {
    const person = people[i]
    const { name, tip } = person
    if (!validateString(name)) {
      return true
    }

    // if (!validateNumber(tip)) {
    //   return true
    // }
  }
}

const validateTax = (tax) => {
  if (!["percent", "dollars"].includes(tax.type)) {
    return true
  }

  // if (!validateNumber(tax.value)) {
  //   return true
  // }
}

const validateNumber = (num) => !isNaN(parseFloat(num))
const validateString = (str) => typeof str === 'string' || str instanceof String
const validateBoolean = (bool) => typeof bool === "boolean"

const validateItems = (items, people) => {
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    const { name, price, eaters, isShared } = item

    if (!validateBoolean(isShared)) {
      return true
    }

    for (let j = 0; j < eaters.length; j++) {
      if (!Number.isInteger(eaters[j])) {
        return true
      }

      if (parseInt(eaters[j]) >= people.length) {
        return true
      }      
    }

    if (!validateNumber(price)) {
      return true
    }

    if (!validateString(name)) {
      return true
    }
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App storedData={getSavedData()} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
