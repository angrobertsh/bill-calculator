import { useCallback, useState } from 'react'

export const People = ({ people, setPeople, items, setItems }) => {
    const [name, setName] = useState('')

    const removeDependentEaters = useCallback((removePersonIdx) => {
        const itemsCopy = [...items]

        itemsCopy.forEach(item => {
            const newEaters = new Set([...item.eaters])
            newEaters.delete(removePersonIdx)
            item.eaters = [...newEaters]
        })

        setItems([...itemsCopy])
    }, [items, setItems])

    const removePerson = useCallback((removeName) => {
        const peopleCopy = [...people]

        const personIdx = peopleCopy.findIndex((people) => people.name === removeName)

        if (personIdx !== -1) {
            peopleCopy.splice(personIdx, 1)
        }

        removeDependentEaters(personIdx)
        setPeople([...peopleCopy])
    }, [people, removeDependentEaters, setPeople])


    const addPerson = useCallback(() => {
        if (people.map(person => person.name).includes(name)) {
            window.alert("Duplicate name found")
            return
        } else if (!name) {
            window.alert("Please enter a valid name")
            return
        }

        setPeople([...people, { name: name, tip: 0 }])

        setName('')
    }, [name, people, setPeople])

    const updatePerson = useCallback((e) => {
        setName(e.currentTarget.value)
    }, [])

    return (
        <div className="section">
            <div className="header">PEOPLE:</div>
                <div className="people">
                    { people.map((person) => (
                        <div className="person" key={person.name}>
                            <div>{person.name}</div>
                            <button onClick={() => removePerson(person.name)}>X</button>
                        </div>
                    ))}
                </div>
            <div>
                <div>Name:</div>
                <input onChange={updatePerson} value={name} />
                <button onClick={addPerson}>Add Person</button>
            </div>
        </div>
    )
}