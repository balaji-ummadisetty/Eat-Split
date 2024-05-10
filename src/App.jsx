import { useState } from "react";
import "./App.css";
const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

const FriendList = ({ friendList, selectedFriend, Onselection }) => {
  return (
    <ul>
      {friendList.map((friend) => {
        return (
          <li
            key={friend.id}
            className={selectedFriend?.id === friend.id ? "selected" : ""}
          >
            <img src={friend.image} alt={friend.name} />
            <h3>{friend.name}</h3>
            {friend.balance < 0 && (
              <p className="red">
                You owe {friend.name} {Math.abs(friend.balance)}€
              </p>
            )}
            {friend.balance > 0 && (
              <p className="green">
                {friend.name} owes you {Math.abs(friend.balance)}€
              </p>
            )}
            {friend.balance === 0 && <p>You and {friend.name} are even</p>}
            <Button onClick={() => Onselection(friend.id)} > {selectedFriend?.id === friend.id ? "Close" : "Select"} </Button>
          </li>
        );
      })}
    </ul>
  );
};

const Split = ({ selectedFriend, onSplitBill }) => {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const paidByFriend = bill ? bill - paidByUser : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");
  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !paidByUser) return;
    onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>

      <label>💰 Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>🧍‍♀️ Your expense</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }
      />

      <label>👫 {selectedFriend.name}'s expense</label>
      <input type="text" disabled value={paidByFriend} />

      <label>🤑 Who is paying the bill</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <Button> Split bill </Button>
    </form>
  );
};
const Addfriend = ({ NewAddfriend }) => {
  const [name, setName] = useState("");
  const [imageurl, setImageurl] = useState("https://i.pravatar.cc/48");
  function handleAddfriendForm(e) {
    e.preventDefault();
    if (!name) return;
    const id = Date.now();
    const url = `${imageurl}?u=${id}`;
    const newFriend = { id: Date.now(), name: name, image: url, balance: 0 };
    NewAddfriend(newFriend);
    setName("");
  }

  return (
    <form className="form-add-friend" onSubmit={handleAddfriendForm}>
      <label>👫 Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>🌄 Image URL</label>
      <input
        type="text"
        value={imageurl}
        onChange={(e) => setImageurl(e.target.value)}
      />
       <Button> Add </Button>
     
    </form>
  );
};

function App() {
  const [friendList, setFriendList] = useState([...initialFriends]);
  const [addForm, setaddForm] = useState(true);
  const [selectedFriend, setSelectedFriend] = useState(null);
  function handleSelection(id) {
    setSelectedFriend((selectedFriend) =>
      friendList.find((friend) => friend?.id === id)
    );
  }
  function handleAddFriend(newFriend) {
    setFriendList((friendList) => [...friendList, newFriend]);
  }
  function onSplitBill(amount) {
    console.log(amount);
    setFriendList((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + amount }
          : friend
      )
    );

    setSelectedFriend(null);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friendList={friendList}
          selectedFriend={selectedFriend}
          Onselection={handleSelection}
        />
        {addForm ? (
          <Button onClick={() => setaddForm(!addForm)}> Add Friend </Button>
        ) : (
          <Addfriend NewAddfriend={handleAddFriend} />
        )}
        {!addForm && (
          <Button onClick={() => setaddForm(!addForm)}> close</Button>
        )}
      </div>
      {selectedFriend && (
        <Split
          selectedFriend={selectedFriend}
          setSelectedFriend={setSelectedFriend}
          onSplitBill={onSplitBill}
          key={selectedFriend.id}
        />
      )}
    </div>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default App;
