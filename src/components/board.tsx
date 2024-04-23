'use client'

import { useState } from 'react'
import classNames from 'classnames'

import Button from './ui/button'
import Modal from './modal'
import { Title } from './ui'

const PLAYER_ONE = '❌'
const PLAYER_TWO = '⭕'

const defaultBoxes = ['', '', '', '', '', '', '', '', '']
const defaultPlayer = PLAYER_ONE

const winningIndices = [
  [0, 1, 2], // horizontal
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6], // vertical
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8], // diagonal
  [2, 4, 6],
]

export default function Board() {
  const [boxes, setBoxes] = useState(defaultBoxes)
  const [player, setPlayer] = useState(defaultPlayer)
  const [isPlayAgainModalOpen, setIsPlayAgainModalOpen] = useState(false)

  const checkWinner = (currentBoxes: string[]) => {
    const filteredWinMap = winningIndices.filter(winArray => {
      return (
        winArray.every(i => currentBoxes[i] === PLAYER_ONE) ||
        winArray.every(i => currentBoxes[i] === PLAYER_TWO)
      )
    })
    return filteredWinMap.length > 0 && filteredWinMap[0]
      ? filteredWinMap[0]
      : []
  }

  const playMove = (index: number) => {
    const newBoxes = [...boxes]
    newBoxes[index] = player
    setBoxes(newBoxes)

    if (checkWinner(newBoxes).length === 0) {
      setPlayer(player === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE)
    }
  }

  const winner = checkWinner(boxes)
  const hasWinner = winner.length > 0
  return (
    <>
      <Title>
        {hasWinner ? 'winner' : 'player'}: {player}
      </Title>
      <ul className='grid w-full grid-cols-3'>
        {boxes.map((box, i) => (
          <li
            key={i}
            className={classNames(
              'border transition-all',
              hasWinner && winner.includes(i)
                ? 'border-cb-yellow'
                : 'border-cb-dusty-blue',
              !(box !== '' || hasWinner) && 'hover:border-cb-mint',
              box !== '' && winner.includes(i) && 'bg-cobalt'
            )}
          >
            <button
              className='flex h-40 w-full items-center justify-center p-4 text-center text-2xl'
              onClick={() => {
                playMove(i)
              }}
              disabled={box !== '' || hasWinner}
            >
              {box}
            </button>
          </li>
        ))}
      </ul>
      <div className='w-full px-4 '>
        <Button
          onClick={() => {
            if (hasWinner) {
              setBoxes(defaultBoxes)
              setPlayer(defaultPlayer)
            } else {
              setIsPlayAgainModalOpen(true)
            }
          }}
          className='disabled:pointer-events-none disabled:opacity-25'
          disabled={boxes.filter(box => box).length === 0}
        >
          {hasWinner ? 'play again' : 'reset'}
        </Button>
      </div>
      <Modal
        isOpen={isPlayAgainModalOpen}
        setIsOpen={setIsPlayAgainModalOpen}
        title='are you sure you want to reset?'
      >
        <Button
          onClick={() => {
            setBoxes(defaultBoxes)
            setPlayer(defaultPlayer)
            setIsPlayAgainModalOpen(false)
          }}
        >
          yes
        </Button>
        <Button
          onClick={() => {
            setIsPlayAgainModalOpen(false)
          }}
        >
          no
        </Button>
      </Modal>
    </>
  )
}
