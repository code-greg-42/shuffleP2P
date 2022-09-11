import SuitLogo from './cardDesign/SuitLogo';

function modClass(...classes) {
    return classes.filter(Boolean).join(' ')
  }

export default function TurnRiverCard(props) {
    const cardValues = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
    const cardSuits = ['bg-gray-800', 'bg-blue-400', 'bg-red-400', 'bg-green-400'];

    return (<>
        <div className={modClass(props.show ? "opacity-100": "opacity-0", "transition-all ease-in-out duration-500")}>
        <div className={`${cardSuits[props.suitRoll]} h-[126px] w-[90px] pointer-events-none select-none border-2 border-transparent rounded-md shadow-2xl`}>
                    <div className="grid">
                    <div className="text-white pl-2 font-bold text-xl">
                        {cardValues[props.cardRoll]}
                    </div>
                    <SuitLogo suitRoll={props.suitRoll} />
                    <div className="text-white font-bold relative inset-0 m-auto text-center text-6xl">
                        {cardValues[props.cardRoll]}
                    </div>
                </div>
                </div>
        </div>
        </>)
}