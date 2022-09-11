import SuitLogo from './cardDesign/SuitLogo'

function modClass(...classes) {
    return classes.filter(Boolean).join(' ')
  }

export default function FlopCards(props) {
    const cardValues = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
    const cardSuits = ['bg-gray-900', 'bg-blue-400', 'bg-red-400', 'bg-green-400'];

    return (<>
        <div className={modClass(props.flopActive ? "opacity-100": "opacity-0", "inline-flex space-x-2 transition-all ease-in-out duration-500")}>
        {props.flopCardRolls.map((cardRolls, index) => (
        <div key={index + 1} className={`${cardSuits[props.flopSuitRolls[index]]} h-[126px] w-[90px] pointer-events-none select-none border-2 border-transparent rounded-md shadow-2xl`}>
                    <div className="grid">
                    <div className="text-white pl-2 font-bold text-xl">
                        {cardValues[cardRolls]}
                    </div>
                    <SuitLogo suitRoll={props.flopSuitRolls[index]} />
                    <div className="text-white font-bold relative inset-0 m-auto text-center text-6xl">
                        {cardValues[cardRolls]}
                    </div>
                </div>
                </div>
        ))}
        </div>
    </>)
}