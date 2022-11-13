import { useCallback, useState } from 'react'

const DEFAULT_ITEM = { name: '', price: '', eaters: [], isShared: false }

export const ItemForm = ({ item, items, setItems, people, afterSave }) => {
    const [newItem, setNewItem] = useState(item ? item : DEFAULT_ITEM)
    const [isShared, setIsShared] = useState(item ? item.eaters.length > 1 : false)

    const updateValue = useCallback((e) => {
        setNewItem({ ...newItem, [e.target.name]: e.target.value })
    }, [setNewItem, newItem])

    const saveItem = useCallback(() => {
        let sanitizedNewItem

        if (isNaN(parseFloat(newItem.price))) {
            sanitizedNewItem = { ...newItem, price: 0 }
        } else {
            sanitizedNewItem = { ...newItem }
        }

        if (item) {
            const dupItems = [...items]
            const idxToEdit = dupItems.findIndex(dupItem => dupItem.name === item.name)
            dupItems[idxToEdit] = sanitizedNewItem

            setItems([...dupItems])
        } else {
            setItems([...items, sanitizedNewItem])
        }

        if (afterSave) { 
            afterSave()
        }

        setNewItem(DEFAULT_ITEM)
        setIsShared(false)
    }, [afterSave, item, items, newItem, setItems])

    const getSelectValue = useCallback(() => {
        if (newItem.eaters.length > 1 || !!isShared) {
            return -1
        }

        if (newItem.eaters.length === 0) {
            return -2
        }

        return people[newItem.eaters[0]].name
    }, [isShared, newItem.eaters, people])

    const updateEaters = useCallback((e) => {
        if (parseFloat(e.target.value) === -1) {
            setIsShared(true)
            setNewItem({ ...newItem, eaters: []})
            return 
        } else if (!!isShared) {
            setIsShared(false)
        }

        const personIdx = people.findIndex(person => person.name === e.target.value)

        setNewItem({ ...newItem, eaters: [personIdx]})
    }, [isShared, newItem, people])

    const updateMultiEaters = useCallback((e, personIdx) => {
        if (personIdx === -3) {
        }

        const eatersDup = [...newItem.eaters]

        if (e.target.checked) {
            setNewItem({ ...newItem, eaters: [...new Set([...eatersDup, personIdx])] })
        } else {
            setNewItem({ ...newItem, eaters: eatersDup.filter(eaterIdx => eaterIdx !== personIdx) })
        }
    }, [newItem])

    const selectAllEaters = useCallback((e) => {
        if (e.target.checked) {
            setNewItem({ ...newItem, eaters: people.map((person, idx) => idx) })
        } else {
            setNewItem({ ...newItem, eaters: [] })
        }            
    }, [newItem, people])

    return (
        <>
            <div>Name:</div>
            <input onChange={updateValue} name="name" value={newItem.name} />
            <div>Price:</div>
            <input onChange={updateValue} type="number" step="0.01" name="price" value={newItem.price} />
            <div>Who ate it?</div>
            <select value={getSelectValue()} onChange={updateEaters}>
                <option key="PLACEHOLDER_NEW_ITEM" disabled value={-2}/>
                <option key="SHARED_NEW_ITEM" disabled={people.length < 1} value={-1}>SHARED</option>
                {people.map(person => (
                    <option key={`NEW_ITEM_${person.name}`} value={person.name}>{person.name}</option>
                ))}
            </select>
            { isShared && 
                <div className="eaters">
                    <div className="checkpair">
                        <div className="checklabel">Everyone</div>
                        <input type="checkbox" checked={newItem.eaters.length === people.length} onChange={selectAllEaters} />
                    </div>
                    {people.map((person, personIdx) => (
                        <div className="checkpair" key={`NEW_ITEM_CHECKBOXES_${person.name}`}>
                            <div className="checklabel">{person.name}</div>
                            <input type="checkbox" checked={newItem.eaters.includes(personIdx)} onChange={(e) => updateMultiEaters(e, personIdx)} />
                        </div>
                    ))}
                </div>                
            }
            <button onClick={saveItem}>{ item ? "💾" : "Add item"}</button>
        </>
    )
}