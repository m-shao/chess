import { useState, useEffect } from 'react'

function App() {
    const [legalSpaces, setLegalSpaces] = useState({})
    const changeLegalSpaces = (coords) => {
        let tempLegal = [...legalSpaces]
        tempLegal.push(coords)
        setLegalSpaces(tempLegal)
    }


    const [selected, setSelected] = useState([-1])
    const [turn, setTurn] = useState("W")


    const [board, setBoard] = useState([["BR1","BK1","BB1","B+","B*","BB2","BK2","0"],
                ["BP1","BP2","BP3","BP4","BP5","BP6","BP7","BP8"],
                ["0","0","0","0","0","0","0","0"],
                ["0","0","0","0","WR2","0","0","0"],
                ["0","0","0","0","BR2","0","0","0"],
                ["0","0","0","0","0","0","0","0"],
                ["WP1","WP2","WP3","WP4","WP5","WP6","WP7","WP8"],
                ["WR1","WK1","WB1","W+1","W*1","WB2","WK2","0"]])


    const changeBoard = (newVal, coords) => {
        let boardTemp = [...board]
        boardTemp[coords[1]][coords[0]] = newVal
        setBoard(boardTemp)
    }


    const handleClick = (piece, coords) => {
        if (selected[0] === -1 && piece[0] === turn){
            setSelected([...coords])
            checkLegal(piece, coords)
        } else if(selected[0] !== -1) {
            if (legalSpaces[coords] === true){
                changeBoard(board[selected[1]][selected[0]] , coords)
                changeBoard("0" , selected)
            }
            setLegalSpaces({})
            setTurn(turn === "W" ? "B" : "W")
            setSelected([-1])
        }
    }

    const checkParalell = (piece, coords) => {
        let tempCoords = [...coords]
        let legalSpacesTemp = {}
        for (let i = 0; i < 2; i++){
            for (let j = -1; j < 2; j = j + 2){
                // if (board[tempCoords[1]][tempCoords[0]] === "0" || board[tempCoords[1]][tempCoords[0]][0] === piece[0]){
                //     console.log('youremom')
                // }

                while (tempCoords[0] < 8 && tempCoords[1] < 8 && tempCoords[0] > -1 && tempCoords[1] > -1 
                    && (board[tempCoords[1]][tempCoords[0]] === "0" || board[tempCoords[1]][tempCoords[0]] === piece)){ 
                    legalSpacesTemp[tempCoords] = true
                    tempCoords[i] = tempCoords[i] + j
                    // console.log("hii")
                }
                tempCoords = [...coords]
            }
        }
        setLegalSpaces(legalSpacesTemp)
    }

    const checkLegal = (piece, coords) => {
        
        if (piece[1] === "R"){
            checkParalell(piece,coords)
            
        } else if (piece[1] === "K"){
            console.log("knight")
        } else if (piece[1] === "B"){
            console.log("bishop")
        } else if (piece[1] === "+"){
            console.log("king")
        } else if (piece[1] === "*"){
            console.log("queen")
        } else if (piece[1] === "P"){
            console.log("pawn")
        }
    }


    return (
        <div className='w-screen h-screen flex justify-center items-center bg-gray-400'>
            <div className='flex flex-col gap-2'>
                {board.map((row, colNum) => (
                    <div className='flex gap-2' key={colNum}>{
                        row.map((item, rowNum) => (
                            <div onClick={() => {handleClick(item, [rowNum, colNum])}} className={'text-gray-400 border-4 flex justify-center items-center w-20 h-20 '
                            + ((rowNum === selected[0] && colNum === selected[1]) ? 'bg-red-400' : legalSpaces[[rowNum, colNum]] === true ? 'bg-green-300 '
                            : ((rowNum + colNum) % 2 === 0 ? 'bg-black border-black ' : 'bg-white border-white '))} key={rowNum}>
                                {item !== "0" &&
                                <div className={' rounded-full border-4 w-12 h-12 flex justify-center items-center ' +
                                ((rowNum + colNum) % 2 === 0 ? 'border-white ' : 'border-black ') +
                                (item[0] === "W" ? 'bg-white' : 'bg-black')}>
                                    {item[1]}
                                </div>}
                            </div>
                        ))}
                    </div>
                )
                )}
            </div>
        </div>
    )
}

export default App
