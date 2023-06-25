import {useState, useEffect} from "react"
import axios from "axios"

const CardViewer = () => {
  const [selectedSet, setSelectedSet] = useState('');
  const [sets, setSets] = useState([])
  const [cards, setCards] = useState([])
  const [pack, setPack] = useState([])
  const [rares, setRares] = useState([])
  const [uncommons, setUncommons] = useState([])
  const [commons, setCommons] = useState([])
  const [draftPicks, setDraftPicks] = useState([])

  useEffect(() => {
    const fetchSets = async () => {
      try {
        const response = await axios.get("https://api.scryfall.com/sets");
        // setSets(response.data.data);
        setSets(response.data.data);
      } catch (error) {
        console.error("Error fetching sets:", error);
      }
    };
    fetchSets();
  }, []);

  const handleSetChange = async (e) => {
    setSelectedSet(e.target.value)
    try {
      const response = await axios.get(`https://api.scryfall.com/cards/search?q=set%3A${e.target.value}`)
      const cards = response.data.data
      setCards(cards);
      setRares(cards.filter(card => card.rarity == "rare"))
      setUncommons(cards.filter(card => card.rarity == "uncommon"))
      setCommons(cards.filter(card => card.rarity == "common"))
      setPack([]);
    } catch (error) {
      console.error("Error fetching cards:", error);
    }
  };

  // const handleDraftPick = (e) => {
  //   let packCard = e.target.value
  //   let selectPick = pack.findIndex(card => card.name == packCard)
  //   let removePick = pack.splice(selectPick, 1)

  //   draftPicks.push(removePick)
  // };

  const handleAddToDraft = (imageUrl) => {
    // Add the selected card image to the draft picks state
    setDraftPicks((prevDraftPicks) => [...prevDraftPicks, imageUrl]);
    setPack((pack) => pack.filter((card) => card.image_uris?.normal !== imageUrl));
  };

  const shuffle = (arr) => {
    let shuffledArr = [...arr].sort(() => 0.5 - Math.random())
    return shuffledArr
  }

  const getRandomItems = (arr, numItems) => {
    let newArr = arr.slice(0, numItems)
    return newArr;
  }

  const generatePack = () => {
    let packCopy = []
    // let rares = cards.filter(card => card.rarity == "rare")
    let raresCopy = shuffle(rares)
    // let raresCopy2 = shuffle(rares);
    let uncommonsCopy = shuffle(uncommons)
    // uncommonsCopy.sort(() => 0.5 - Math.random());
    let commonsCopy = shuffle(commons)
    // let uncommons = cards.filter(card => card.rarity == "uncommon")
    // let commons = cards.filter(card => card.rarity == "common")

    // let randomRare = raresCopy.slice(0, 1);
    let randomRare = getRandomItems(raresCopy, 1);
    let randomUncommons = getRandomItems(uncommonsCopy, 3);
    let randomCommons = getRandomItems(commonsCopy, 10);
    

    packCopy = packCopy.concat(randomRare, randomUncommons, randomCommons)
    
    // packCopy.push(randomUncommons)
    // packCopy.push(randomCommons)
    setPack(packCopy)
    debugger
  }
  
  return (
    <div>
      <h1>Card Viewer</h1>
      <select value={selectedSet} onChange={handleSetChange}>
        <option value="">Select a Set</option>
        {sets.map(set => (
          <option key={set.code} value={set.code}>
            {set.name}
          </option>
        ))}
      </select>
      <button onClick={generatePack}>Open a Pack</button>
      <div
      style={{
        display: "grid",
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 300px))'
      }}>
        {pack.map(card => (
            <div key={card.id} style={{ padding: '0.5rem'}}>
              <img
              src={card.image_uris?.normal}
              alt={card.name}
              style={{width: "100%", height: "auto"}}
              onClick={() => handleAddToDraft(card.image_uris?.normal)}
              />
            </div>
          ))}
      </div>
      <span>Your Draft Picks</span>
      <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 300px)"
      }}>
        {draftPicks.map((imageUrl, index) => (
          <div key={imageUrl.id} style = {{ padding: "0.5rem"}}>
          <img key={index} 
          src={imageUrl} 
          alt={`Draft Pick ${index}`} 
          style={{width: "100%", height: "auto"}}
          />
          </div>
        ))}
      {/* {draftPicks.map(card => (
        <div key={card.id} style={{ padding: '0.5rem'}}>
        <img
        src={card.image_uris?.normal}
        alt={card.name}
        style={{width: "100%", height: "auto"}}
        />
      </div>
      ))} */}
      </div>
    </div>
  );
};

export default CardViewer