'use client'

import { useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/solid'
import classNames from 'classnames'

import Modal from './modal'
import { Title, Button } from './ui'

function XIcon() {
  return <XMarkIcon className='text-cb-mint h-8 w-8' />
}

function CircleIcon() {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className='lucide lucide-circle text-cb-orange'
    >
      <circle cx='12' cy='12' r='10' />
    </svg>
  )
}

const PLAYER_ONE = 'x'
const PLAYER_TWO = 'o'

const Icon: Record<string, JSX.Element> = {
  [PLAYER_ONE]: <XIcon />,
  [PLAYER_TWO]: <CircleIcon />,
}

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

const MAX_MOVES = 6

export default function Board() {
  const [boxes, setBoxes] = useState(defaultBoxes)
  const [player, setPlayer] = useState(defaultPlayer)
  const [isPlayAgainModalOpen, setIsPlayAgainModalOpen] = useState(false)
  const [moves, setMoves] = useState<number[]>([])

  const resetGame = () => {
    setBoxes(defaultBoxes)
    setPlayer(defaultPlayer)
    setMoves([])
  }

  const updateMoveHistory = (index: number) => {
    const newMoves = [...moves]
    newMoves.push(index)
    const indexAboutToBeRemove =
      newMoves.length > MAX_MOVES ? newMoves.shift() : undefined
    setMoves(newMoves)
    return indexAboutToBeRemove
  }

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
    const indexAboutToBeRemove = updateMoveHistory(index)

    const newBoxes = [...boxes]
    newBoxes[index] = player
    if (indexAboutToBeRemove !== undefined) {
      newBoxes[indexAboutToBeRemove] = ''
    }
    setBoxes(newBoxes)

    if (checkWinner(newBoxes).length === 0) {
      setPlayer(player === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE)
    }
  }

  const winner = checkWinner(boxes)
  const hasWinner = winner.length > 0

  const indexAboutToBeRemove = moves.length === MAX_MOVES ? moves[0] : undefined
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
              'border-2 transition-all',
              hasWinner && winner.includes(i)
                ? 'border-cb-yellow'
                : 'border-cb-dusty-blue',
              !(box !== '' || hasWinner) && 'hover:border-cb-mint',
              box !== '' && winner.includes(i) && 'bg-cobalt'
            )}
          >
            <button
              className={classNames(
                'flex h-40 w-full items-center justify-center p-4 text-center',
                indexAboutToBeRemove === i && 'opacity-10'
              )}
              onClick={() => {
                playMove(i)
              }}
              disabled={box !== '' || hasWinner}
            >
              {Icon[box]}
            </button>
          </li>
        ))}
      </ul>
      <div className='w-full px-4 '>
        <Button
          onClick={() => {
            if (hasWinner) {
              resetGame()
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
            resetGame()
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
