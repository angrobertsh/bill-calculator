import { useCallback, useEffect, useState } from 'react'
import './App.css';
import { People } from './People'
import { Items } from './Items'
import { Totals } from './Totals'

// Schema: 
// {
//   people: [{ name: "John", tip: "18.0" }],
//   tax: "10.5",
//   items: [{ name: "Egg rolls", price: "100.00", eaters: [0], isShared true }],
// }

const App = () => {
  const [people, setPeople] = useState([])
  const [tax, setTax] = useState(10.50)
  const [items, setItems] = useState([])

  useEffect(() => {
    localStorage.setItem("BillSplitter", JSON.stringify({
      people,
      tax,
      items,
    }))
  }, [items, people, tax])

  useEffect(() => {
    try {
      const storedData = JSON.parse(localStorage.getItem("BillSplitter"))
      setPeople(storedData.people || [])
      setTax(storedData.tax || 10.50)
      setItems(storedData.items || [])
    } catch (e) {
      console.log("failed to load data")
    }
  }, [])

  const clearAll = useCallback(() => {
    setItems([])
    setTax(10.50)
    setPeople([])
    localStorage.setItem("BillSplitter", '{}')
  }, [])

  return (
    <div className="App">
      <People items={items} people={people} setItems={setItems} setPeople={setPeople} />
      <Items items={items} people={people} setItems={setItems} />
      <Totals items={items} people={people} setTax={setTax} setPeople={setPeople} tax={tax} />
      <div className="clearAll">
        <button className="clearAllButton" onClick={clearAll}>CLEAR ALL DATA</button>
      </div>
    </div>
  );
}

export default App;
