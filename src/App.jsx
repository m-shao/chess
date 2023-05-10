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


    const [board, setBoard] = useState([["BR1","BK1","BB1","B+1","B*1","BB2","BK2","BR2"],
                ["BP1","BP2","BP3","BP4","BP5","BP6","BP7","BP8"],
                ["0","0","0","0","0","0","0","0"],
                ["0","0","0","W*1","0","0","0","0"],
                ["0","B+1","0","WK1","WR2","0","0","0"],
                ["0","0","0","0","0","0","0","0"],
                ["WP1","WP2","WP3","WP4","WP5","WP6","WP7","WP8"],
                ["WR1","WK1","WB2","W+1","W*1","WB2","WK2","WR2"]])


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

            if (legalSpaces[coords] === true && (selected[0] !== coords[0] || selected[1] !== coords[1])){
                changeBoard(board[selected[1]][selected[0]] , coords)
                changeBoard("0" , selected)
                setTurn(turn === "W" ? "B" : "W")
            }
            setLegalSpaces({})
            setSelected([-1])
        }
    }

    const checkDiagonal = (piece, coords, limit) => {
        limit = limit + 1
        let tempCoords = [...coords]
        let legalSpacesTemp = {}
        let limitCount = 0
        for (let i = -1; i < 2; i = i + 2){
            for (let j = -1; j < 2; j = j + 2){
                while (tempCoords[0] < 8 && tempCoords[1] < 8 && tempCoords[0] > -1 && tempCoords[1] > -1 
                    && (board[tempCoords[1]][tempCoords[0]] === "0" || board[tempCoords[1]][tempCoords[0]][0] !== piece[0] || board[tempCoords[1]][tempCoords[0]] === piece) && limitCount !== limit){ 
                    legalSpacesTemp[tempCoords] = true
                    if (board[tempCoords[1]][tempCoords[0]][0] === (piece[0] === "W" ? "B" : "W")){
                        break
                    }
                    tempCoords[0] = tempCoords[0] + i
                    tempCoords[1] = tempCoords[1] + j
                    limitCount++
                }
                limitCount = 0
                tempCoords = [...coords]
            }
        }
        return legalSpacesTemp
    }

    const checkParalell = (piece, coords, limit) => {
        limit = limit + 1
        let tempCoords = [...coords]
        let legalSpacesTemp = {}
        let limitCount = 0
        for (let i = 0; i < 2; i++){
            for (let j = -1; j < 2; j = j + 2){
                limitCount = 0
                while (tempCoords[0] < 8 && tempCoords[1] < 8 && tempCoords[0] > -1 && tempCoords[1] > -1 
                    && (board[tempCoords[1]][tempCoords[0]] === "0" || board[tempCoords[1]][tempCoords[0]][0] !== piece[0] || board[tempCoords[1]][tempCoords[0]] === piece) && limitCount !== limit){ 
                    legalSpacesTemp[tempCoords] = true
                    if (board[tempCoords[1]][tempCoords[0]][0] === (piece[0] === "W" ? "B" : "W")){
                        break
                    }
                    tempCoords[i] = tempCoords[i] + j
                    limitCount++
                    
                }
                    
                limitCount = 0
                tempCoords = [...coords]
            }
        }
        return legalSpacesTemp
    }

    const checkL = (piece, coords) => {
        let tempCoords = [...coords]
        let legalSpacesTemp = {}
        for (let i = -1; i < 2; i = i + 2){
            for (let j = -1; j < 2; j = j + 2){
                if (!(tempCoords[0] + i * 2 >= 8 && tempCoords[0] + i * 2 < 0 && tempCoords[1] + i * 2 < 0 && tempCoords[1] + i * 2 >= 8)){
                    if (board[tempCoords[0] + i * 2][tempCoords[1] + j][0] !== piece[0] && board[tempCoords[0]  + j][tempCoords[1] + i * 2][0] !== piece[0]){
                    legalSpacesTemp[[tempCoords[0] + i * 2, tempCoords[1] + j]] = true
                    legalSpacesTemp[[tempCoords[0]  + j, tempCoords[1] + i * 2]] = true
                    }
                }
            }
        }
        return legalSpacesTemp
    }

    const checkLegal = (piece, coords) => {
        
        if (piece[1] === "R"){
            const legal = checkParalell(piece,coords, 10)
            setLegalSpaces(legal)
            
        } else if (piece[1] === "K"){
            const legal = checkL(piece,coords)
            setLegalSpaces(legal)
        } else if (piece[1] === "B"){
            const legal = checkDiagonal(piece,coords, 10)
            setLegalSpaces(legal)
            
        } else if (piece[1] === "+"){
            let legal1 = checkParalell(piece,coords, 1)
            let legal2 = checkDiagonal(piece,coords, 1)
            setLegalSpaces({...legal1, ...legal2})
        } else if (piece[1] === "*"){
            let legal1 = checkParalell(piece,coords, 10)
            let legal2 = checkDiagonal(piece,coords, 10)
            setLegalSpaces({...legal1, ...legal2})
            
        } else if (piece[1] === "P"){
            // console.log("pawn")
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
