import SuitLogo from './cardDesign/SuitLogo'

function modClass(...classes) {
    return classes.filter(Boolean).join(' ')
  }

export default function Card(props) {
    const cardValues = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
    const cardSuits = ['bg-gray-800', 'bg-blue-400', 'bg-red-400', 'bg-green-400'];
    const cardValue = cardValues[props.cardRoll];
    const suitClass = cardSuits[props.suitRoll];

    return (<>
        <div className={modClass(props.show ? "opacity-100": "opacity-0", `${suitClass} transition-all ease-in duration-500 h-[168px] w-[120px] pointer-events-none select-none border-2 border-transparent rounded-md shadow-2xl`)}>
                    <div className="grid">
                    <div className="text-white pl-2 font-bold text-2xl">
                        {cardValue}
                    </div>
                    <SuitLogo suitRoll={props.suitRoll} />
                    <div className="text-white font-bold relative inset-0 m-auto text-center text-8xl">
                        {cardValue}
                    </div>
                </div>
                </div>
    </>)
}