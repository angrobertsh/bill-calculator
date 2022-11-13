import { useCallback, useEffect, useState } from 'react'
import './App.css';
import { People } from './People'
import { Items } from './Items'
import { Totals } from './Totals'

// Schema: 
// {
//   people: [{ name: "John", tip: "18.0" }],
//   tax: { type: "percent", value: "10.5" },
//   items: [{ name: "Egg rolls", price: "100.00", eaters: [0], isShared true }],
// }

const App = ({ storedData }) => {
  const [people, setPeople] = useState(storedData.people || [])
  const [tax, setTax] = useState(storedData.tax || { type: "percent", value: 10.5 })
  const [items, setItems] = useState(storedData.items || [])

  useEffect(() => {
    const currentState = JSON.stringify({
      people,
      tax,
      items,
    })

    localStorage.setItem("BillSplitter", currentState)
  }, [items, people, tax])

  const clearAll = useCallback(() => {
    setItems([])
    setTax({ type: "percent", value: 10.5 })
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
