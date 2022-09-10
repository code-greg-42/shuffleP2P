import Card from './Components/Card';
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
  const [suitRoll, setSuitRoll] = useState(null);
  const [cardRoll, setCardRoll] = useState(null);
  const [cardShow, setCardShow] = useState(false);

  const chatRef = useRef();
  const addressRef = useRef();
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

  const connect = async (e) => {
    e.preventDefault();
    try {
        await connectWallet();
        console.log(xmtp);
        conversation = await xmtp.conversations.newConversation(addressRef.current.value);
        const chatMessages = await conversation.messages();
        console.log(chatMessages);
        setChatLog(chatMessages);
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

  function handleCardRoll() {
      setCardRoll(Math.floor(Math.random() * 13));
      setSuitRoll(Math.floor(Math.random() * 4));
      setCardShow(true);
  }

  return (
    <>
    <div className="w-screen h-screen bg-black">
    <div>
      <Card suitRoll={suitRoll} cardRoll={cardRoll} show={cardShow} />
    </div>
    <button onClick={handleCardRoll}
          className="w-1/6 h-16 mr-2 text-green-400 hover:text-white shadow-xl shadow-gray-700 rounded-xl font-mono border border-transparent bg-gray-900">
          randomize_card
    </button>
    <div className="w-1/2 h-1/2 fixed left-2 bottom-2">
      <form onSubmit={e => connect(e)}>
      <div className="flex w-full">
        <input type="text" placeholder="enter recipient address here..." ref={addressRef} className="bg-gray-900 w-1/2 p-2 text-green-400 rounded-xl mr-2 focus:outline-none shadow-xl shadow-gray-700" />
        <button
        className="w-1/4 h-16 mr-2 text-green-400 hover:text-white shadow-xl shadow-gray-700 rounded-xl border border-transparent bg-gray-900">
          start_convo
        </button>
      </div>
      </form>
      <div className="h-2/3 text-gray-300 w-3/4 overflow-y-auto rounded-lg p-4 mt-6 mb-4 bg-gray-800">
      {chatLog.map((msg, index) => (
        <div key={index} className={modClass(msg.senderAddress === address ? "justify-start": "justify-end", "inline-flex w-full")}>
        <p className={modClass(msg.senderAddress === address ? "text-gray-300 text-left": "text-right text-green-200", "p-2")}>{msg.content}</p>
      </div>
      ))}
        <div ref={chatRef} />
      </div>
      <form onSubmit={e => messageSend(e)}>
      <div className="flex w-full">
        <input disabled={!xmtpConnected} type="text" ref={sendChatRef} placeholder="enter text here..." className="bg-gray-900 w-1/2 p-2 text-green-400 rounded-xl mr-2 focus:outline-none shadow-xl shadow-gray-700" />
        <button disabled={!xmtpConnected}
        className="w-1/4 h-16 mr-2 text-green-400 hover:text-white shadow-xl shadow-gray-700 rounded-xl border border-transparent bg-gray-900">
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
