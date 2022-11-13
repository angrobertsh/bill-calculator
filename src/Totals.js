import { useCallback, useMemo } from 'react'

export const Totals = ({ items, people, tax, setPeople, setTax, clearAll}) => {
    const totalsNoTip = useMemo(() => 
        items.reduce((acc, item) => {
            item.eaters.forEach(eater => {
                const price = parseFloat((parseFloat(item.price) / item.eaters.length * (1 + parseFloat(tax || 0) / 100.00)).toFixed(2))
                if (!acc[eater]) {
                    acc[eater] = price
                } else {
                    acc[eater] += price
                }
            })

            return acc
        }, []), 
    [items, tax])

    const totalNoTip = useMemo(() => 
        totalsNoTip.reduce((acc, total) => {
            acc += total
            return acc
        }, 0), 
    [totalsNoTip])

    const totalsWithTip = useMemo(() => 
        totalsNoTip.map((total, idx) => parseFloat((total * (1 + parseFloat(people[idx].tip || 0) / 100.00)).toFixed(2))
    ), [people, totalsNoTip])

    const totalWithTip = useMemo(() => 
        totalsWithTip.reduce((acc, total) => {
            acc += total
            return acc
        }, 0), 
    [totalsWithTip])

    console.log('totalsWithTip', totalsWithTip)

    const updateTip = useCallback((personIdx, e) => {
        const peopleClone = [...people]
        peopleClone[personIdx].tip = e.target.value
        setPeople(peopleClone)
    }, [people, setPeople])

    return (
        <div className="section">
            <div id="totals">
                <div className="header">TOTALS:</div>
                <div id="tax">
                    <div>Tax %:</div>
                    <input type="number" step="0.01" onChange={(e) => setTax(e.target.value)} value={tax} />
                </div>
                { people.map((person, idx) => (
                    <div key={`${person.name}_total`} className="person">
                        <div>{person.name}</div>
                        <div>${totalsNoTip[idx]}</div>
                        <div className="tipinput">
                            <div className="tip">Tip %:</div>
                            <input className="tipNumber" type="number" step="0.01" value={person.tip} onChange={(e) => updateTip(idx, e)}></input>
                        </div>
                        <div className="thenumber">${totalsWithTip[idx]} </div>
                    </div>                
                ))}
            </div>
            <div>
                Total no tip: ${totalNoTip.toFixed(2)}
            </div>
            <div>
                Total with tip: ${totalWithTip.toFixed(2)}
            </div>
        </div>
    )
}