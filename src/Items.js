import { Item } from './Item'
import { ItemForm } from './ItemForm'

export const Items = ({ people, items, setItems }) => {
    return (
        <div className="section">
            <div className="header">FOOD:</div>
            <div className="items">
                { items.map((item) => (
                    <Item key={item.name} items={items} item={item} people={people} setItems={setItems} />
                ))}
            </div>
            <div className="newform">
                <ItemForm item={null} items={items} people={people} setItems={setItems} />
            </div>
        </div>
    )
}