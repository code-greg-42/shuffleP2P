export default function ActionButtons(props) {

    function handleActionInput(e) {
        if (e.target.value > 2 && e.target.value < 100) {
            props.setActionSlider(e.target.value);
        } else {
            props.setActionSlider(2);
        }
    }

     return (<>      
    <div className="z-10 grid mt-2">
        <div className="inline-flex items-center">
        <input className="w-full h-2 mt-2 bg-gray-800 rounded-lg appearance-none cursor-pointer" type="range" min="2" max="100" step="0.5" value={props.actionSlider} onChange={e => props.setActionSlider(e.target.value)} />
        <input type="number" min="2" max="100" className="w-40 h-12 ml-2 text-white font-mono focus:outline-none text-center font-semibold rounded-md bg-gray-700 shadow-xl shadow-gray-800" value={props.actionSlider} onChange={e => handleActionInput(e)} />
        </div>
            <div className="inline-flex mt-4 space-x-3 mx-auto">
            <button onClick={props.fold}
            className="w-40 h-20 text-white font-mono font-semibold rounded-md bg-gray-900 shadow-xl hover:bg-gray-700 shadow-gray-800">
                Fold
            </button>
            <button onClick={props.fetchCardRolls}
            className="w-40 h-20 text-white font-mono font-semibold rounded-md bg-gray-900 shadow-xl hover:bg-gray-700 shadow-gray-800">
                Call
            </button>
            <button onClick={props.fetchCardRolls}
            className="w-40 h-20 text-white font-mono font-semibold rounded-md bg-gray-900 shadow-xl hover:bg-gray-700 shadow-gray-800">
                Raise {props.actionSlider} bb
            </button>
            </div>
    </div>
    </>)
}