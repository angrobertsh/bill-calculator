import { useCallback, useMemo } from 'react'

const sum = (arr) => 
    arr.reduce((acc, num) => {
        acc += num
        return acc
    }, 0)


export const Totals = ({ items, people, tax, setPeople, setTax}) => {
    const totalCostNoTax = useMemo(() => {
        const prices = items.map(item => parseFloat(item.price))

        return sum(prices)
    }, [items])

    const taxFactor = useMemo(() => {
        if (tax.value === '' || isNaN(parseFloat(tax.value))) {
            return 1
        }

        if (tax.type === "percent") {
            return 1 + (parseFloat(tax.value)) / 100.00
        }
        
        const proportion = parseFloat(tax.value) / (parseFloat(totalCostNoTax) || 1)

        return 1 + parseFloat(proportion.toFixed(2))
    }, [totalCostNoTax, tax])

    const totalTax = useMemo(() => (
        tax.type === "dollars" ? (parseFloat(tax.value) || 0) : totalCostNoTax * parseFloat(tax.value || 0) / 100
    ), [tax.type, tax.value, totalCostNoTax])

    const pricePerPerson = useCallback(item => parseFloat(item.price) / item.eaters.length, [])

    const totalsNoTip = useMemo(() => 
        items.reduce((acc, item) => {
            item.eaters.forEach(eater => {
                const price = parseFloat(parseFloat(pricePerPerson(item) * taxFactor).toFixed(2))

                if (!acc[eater]) {
                    acc[eater] = price
                } else {
                    acc[eater] += price
                }
            })

            return acc
        }, []), 
    [items, pricePerPerson, taxFactor])

    const totalNoTip = useMemo(() => sum(totalsNoTip), [totalsNoTip])

    const totalsWithTip = useMemo(() => (
        totalsNoTip.map((total, idx) => (
            parseFloat((total * (1 + parseFloat(people[idx].tip || 0) / 100.00)).toFixed(2)
        )))
    ), [people, totalsNoTip])

    const totalWithTip = useMemo(() => sum(totalsWithTip), [totalsWithTip])

    const updateTip = useCallback((personIdx, e) => {
        const peopleClone = [...people]
        peopleClone[personIdx].tip = e.target.value
        setPeople(peopleClone)
    }, [people, setPeople])

    const updateTax = useCallback((e) => {
        setTax({ ...tax, [e.target.name]: e.target.value })
    }, [setTax, tax])

    return (
        <div className="section">
            <div id="totals">
                <div className="header">TOTALS:</div>
                <div id="tax">
                    <div>Tax:</div>
                    <div className="taxArea">
                        <div className="taxInputs">
                            <input type="number" step="0.01" name="value" onChange={updateTax} value={tax.value} />
                            <select value={tax.type} name="type" onChange={updateTax}>
                                <option value="percent">%</option>
                                <option value="dollars">$</option>
                            </select>
                        </div>
                        { tax.type === "percent" && (
                            <div className="taxTotal">Tax total: ${totalTax.toFixed(2)}</div>
                        )}
                    </div>
                </div>
                { people.map((person, idx) => (
                    <div key={`${person.name}_total`} className="person">
                        <div>{person.name}</div>
                        <div>${totalsNoTip[idx]}</div>
                        <div className="tipinput">
                            <div className="tip">Tip %</div>
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