import Card from './Components/Card';
import ActionButtons from './Components/ActionButtons';
import Cardbacks from './Components/cardDesign/Cardbacks';
import FlopCards from './Components/FlopCards';
import TurnRiverCard from './Components/TurnRiverCard';
import { ethers } from "ethers";
import { Client } from '@xmtp/xmtp-js';
import { useState, useEffect, useRef } from 'react';

function modClass(...classes) {
  return classes.filter(Boolean).join(' ')
}

let provider, xmtp, signer, address, conversation = null;

function App() {
  const [xmtpConnected, setXmtpConnected] = useState(false);
  const [chatLog, setChatLog] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [startingCardOne, setStartingCardOne] = useState(null);
  const [startingCardTwo, setStartingCardTwo] = useState(null);
  const [startingSuitOne, setStartingSuitOne] = useState(null);
  const [startingSuitTwo, setStartingSuitTwo] = useState(null);
  const [cardOneShow, setCardOneShow] = useState(false);
  const [cardTwoShow, setCardTwoShow] = useState(false);
  const [chatShow, setChatShow] = useState(false);
  const [actionSlider, setActionSlider] = useState(2);
  const [flopCardRolls, setFlopCardRolls] = useState([]);
  const [flopSuitRolls, setFlopSuitRolls] = useState([]);
  const [flopActive, setFlopActive] = useState(false);
  const [turnCardRoll, setTurnCardRoll] = useState(null);
  const [turnSuitRoll, setTurnSuitRoll] = useState(null);
  const [turnActive, setTurnActive] = useState(false);
  const [riverCardRoll, setRiverCardRoll] = useState(null);
  const [riverSuitRoll, setRiverSuitRoll] = useState(null);
  const [riverActive, setRiverActive] = useState(false);

  const chatRef = useRef();
  const sendChatRef = useRef();

  useEffect(() => {
    async function listenForMessages() {
      for await (const message of await conversation.streamMessages()) {
          setNewMessage(message);
      }
    }
    if (xmtpConnected) {
      listenForMessages();
    }
  }, [xmtpConnected]);

  useEffect(() => {
    if (newMessage !== "") {
      setChatLog([...chatLog, newMessage]);
      setNewMessage("");
    }
  }, [newMessage, chatLog])

  useEffect(() => {
    chatRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [chatLog]);

  const connect = async () => {
    try {
        await connectWallet();
        console.log(xmtp);
        conversation = await xmtp.conversations.newConversation('0xA88a5E76fA13a771C22b1631dFBAFDd1fC060ee0');
        setXmtpConnected(true);
    } catch(e) {
        conversation = null;
        console.log(e);
    };
  };

  async function connectWallet() {
    try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        xmtp = await Client.create(signer);
        address = await signer.getAddress();
    } catch(e) {
        console.log(e);
        provider = null;
        signer = null;
        xmtp = null;
        address = null;
    };
  }

  async function messageSend(e) {
      e.preventDefault();
      await conversation.send(sendChatRef.current.value);
      console.log('message sent!');
      sendChatRef.current.value = "";
  }

  function handleStartingRoll() {
    let randomStartingCards = [Math.floor(Math.random() * 13), Math.floor(Math.random() * 4), Math.floor(Math.random() * 13), Math.floor(Math.random() * 4)];
      setStartingCardOne(randomStartingCards[0]);
      setStartingSuitOne(randomStartingCards[1]);
      setCardOneShow(true);
      setStartingCardTwo(randomStartingCards[2]);
      setStartingSuitTwo(randomStartingCards[3]);
      setCardTwoShow(true);
  }

  function handleFlopRoll() {
    let randomCards = [Math.floor(Math.random() * 13), Math.floor(Math.random() * 4), Math.floor(Math.random() * 13), Math.floor(Math.random() * 4), Math.floor(Math.random() * 13), Math.floor(Math.random() * 4)];
    setFlopCardRolls([randomCards[0], randomCards[2], randomCards[4]]);
    setFlopSuitRolls([randomCards[1], randomCards[3], randomCards[5]]);
    setFlopActive(true);
  }

  function handleTurnRoll() {
    let randomRolls = [Math.floor(Math.random() * 13), Math.floor(Math.random() * 4)];
    setTurnCardRoll(randomRolls[0]);
    setTurnSuitRoll(randomRolls[1]);
    setTurnActive(true);
  }

  function handleRiverRoll() {
    let randomRolls = [Math.floor(Math.random() * 13), Math.floor(Math.random() * 4)];
    setRiverCardRoll(randomRolls[0]);
    setRiverSuitRoll(randomRolls[1]);
    setRiverActive(true);
  }

  function handleResetHand() {
    setFlopActive(false);
    setTurnActive(false);
    setRiverActive(false);
    setCardOneShow(false);
    setCardTwoShow(false);
  }

  return (
    <>
    <div className="w-screen h-screen bg-black">
    <img className="fixed top-2 left-12" src={require('./media/shuffle-logo-2.png')} alt="site-logo" />
    <div className="z-10 fixed inset-0 w-[950px] h-[748px] mx-auto mt-24">
    <div className="h-12 bg-gray-900 rounded-t-xl w-full">
    </div>
    <div className="w-[950px] h-[550px] m-auto bg-gray-700 shadow-xl shadow-gray-800 rounded-lg">
      <div className="flex w-full justify-center -translate-x-2.5 -translate-y-2">
      <Cardbacks />
      </div>
    <div className="absolute top-1/2 left-1/2 -translate-y-48 -translate-x-[240px]">
      <FlopCards flopCardRolls={flopCardRolls} flopSuitRolls={flopSuitRolls} flopActive={flopActive} />
    </div>
    <div className="absolute inline-flex space-x-2 top-1/2 -translate-y-48 left-1/2 translate-x-[54px]">
      <TurnRiverCard cardRoll={turnCardRoll} suitRoll={turnSuitRoll} show={turnActive} />
      <TurnRiverCard cardRoll={riverCardRoll} suitRoll={riverSuitRoll} show={riverActive} />
    </div>
    <div className="grid absolute bottom-[164px] left-1/2 -translate-x-1/2 space-y-2">
    <div className="inline-flex space-x-2">
      <Card cardRoll={startingCardOne} suitRoll={startingSuitOne} show={cardOneShow} />
      <Card cardRoll={startingCardTwo} suitRoll={startingSuitTwo} show={cardTwoShow} />
    </div>
    </div>
    </div>
    <ActionButtons actionSlider={actionSlider} setActionSlider={setActionSlider} />
    </div>
    <div className="fixed top-0 right-7 grid space-y-7 mt-24 w-1/6">
    <button onClick={connect}
          className="w-full h-16 mr-2 text-green-400 hover:text-white shadow-xl shadow-gray-700 rounded-xl font-mono border border-transparent bg-gray-900">
          connect_chat
    </button>
    <button onClick={handleStartingRoll}
          className="w-full h-16 mr-2 text-green-400 hover:text-white shadow-xl shadow-gray-700 rounded-xl font-mono border border-transparent bg-gray-900">
          roll_starting_hand
    </button>
    <button onClick={handleFlopRoll}
          className="w-full h-16 mr-2 text-green-400 hover:text-white shadow-xl shadow-gray-700 rounded-xl font-mono border border-transparent bg-gray-900">
          roll_flop
    </button>
    <button onClick={handleTurnRoll}
          className="w-full h-16 mr-2 text-green-400 hover:text-white shadow-xl shadow-gray-700 rounded-xl font-mono border border-transparent bg-gray-900">
          roll_turn
    </button>
    <button onClick={handleRiverRoll}
          className="w-full h-16 mr-2 text-green-400 hover:text-white shadow-xl shadow-gray-700 rounded-xl font-mono border border-transparent bg-gray-900">
          roll_river
    </button>
    <button onClick={handleResetHand}
          className="w-full h-16 mr-2 text-green-400 hover:text-white shadow-xl shadow-gray-700 rounded-xl font-mono border border-transparent bg-gray-900">
          reset_hand
    </button>
    </div>
    <div className={modClass(chatShow ? "": "-translate-x-[570px]", "w-[600px] h-1/2 z-20 transition-transform duration-300 ease-in-out opacity-75 fixed left-0 bottom-0")}>
      <div className="h-4/5 text-gray-300 relative w-full overflow-y-auto bg-gray-800">
        {xmtpConnected ? <div className="justify-start grid w-full">
          <p className="text-gray-400 text-left pl-2 pt-2">you have connected to 0xA88a5E76fA13a771C22b1631dFBAFDd1fC060ee0</p>
          <p className="text-gray-400 text-left pl-2">---- good luck! ----</p>
        </div>: ""}
        <div onClick={() => setChatShow(!chatShow)} className="absolute top-0 right-0 cursor-pointer text-gray-400 hover:text-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-7 h-7">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
          </svg>
        </div>
      {chatLog.map((msg, index) => (
        <div key={index} className={modClass(msg.senderAddress === address ? "justify-start": "justify-end", "inline-flex w-full")}>
        <p className={modClass(msg.senderAddress === address ? "text-gray-300 text-left": "text-right text-green-200", "p-2")}>{msg.content}</p>
      </div>
      ))}
        <div ref={chatRef} />
      </div>
      <form onSubmit={e => messageSend(e)}>
      <div className="flex h-1/5 w-full">
        <input disabled={!xmtpConnected} type="text" ref={sendChatRef} placeholder="enter text here..." className="bg-gray-900 w-3/4 p-2 text-green-400 focus:outline-none shadow-xl shadow-gray-700" />
        <button disabled={!xmtpConnected}
        className="w-1/4 text-green-400 hover:text-white shadow-xl shadow-gray-700 border border-transparent bg-gray-900">
          send_msg
        </button>
      </div>
      </form>
    </div>
    </div>
    </>
  );
}

export default App;
